const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'sinanjet_gizli_anahtar_123';

// --- YARDIMCI FONKSİYONLAR ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// --- GENEL / KULLANICI ROTALARI ---

// Şehirleri Listele
app.get('/api/cities', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM cities');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Veritabanı hatası!" });
    }
});

// Uçuş Arama (GEÇMİŞ UÇUŞ FİLTRESİ EKLENDİ)
app.get('/api/flights/search', async (req, res) => {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
        return res.status(400).json({ error: "Lütfen tüm arama alanlarını doldurun." });
    }

    try {
        const [results] = await db.query(
            `SELECT f.*, c1.city_name as from_city_name, c2.city_name as to_city_name 
             FROM flights f
             JOIN cities c1 ON f.from_city_id = c1.city_id
             JOIN cities c2 ON f.to_city_id = c2.city_id
             WHERE f.from_city_id = ? 
               AND f.to_city_id = ? 
               AND DATE(f.departure_time) = ?
               AND f.departure_time >= NOW()`, // Geçmiş saatli uçuşları göstermez
            [from, to, date]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Arama sırasında bir hata oluştu." });
    }
});

// Bilet Satın Alma & Koltuk Düşürme (GEÇMİŞ UÇUŞ KONTROLÜ EKLENDİ)
app.post('/api/tickets', async (req, res) => {
    const { flight_id, passenger_name, passenger_surname, class_type, passenger_email, seat_number } = req.body;

    try {
        // Boş koltuk durumu ile beraber kalkış vaktini de çekiyoruz
        const [[flight]] = await db.query('SELECT seats_available, departure_time FROM flights WHERE flight_id = ?', [flight_id]);
        
        if (!flight) {
            return res.status(404).json({ success: false, error: "Uçuş bulunamadı." });
        }

        // ZAMAN BARİYERİ: Uçuşun tarihi geçmişse satışı engelle
        if (new Date(flight.departure_time) < new Date()) {
            return res.status(400).json({ 
                success: false, 
                error: "Hata: Kalkış saati geçmiş, tamamlanmış bir uçuşa bilet satın alınamaz!" 
            });
        }

        if (flight.seats_available <= 0) {
            return res.status(400).json({ success: false, error: "Bu uçuşta boş koltuk kalmadı! Satış yapılamaz." });
        }

        // 1. Bileti Kaydet
        const [result] = await db.query(
            'INSERT INTO tickets (flight_id, passenger_name, passenger_surname, class_type, passenger_email, seat_number) VALUES (?, ?, ?, ?, ?, ?)',
            [flight_id, passenger_name, passenger_surname, class_type, passenger_email, seat_number]
        );

        const newTicketId = result.insertId;
        console.log(">>> Bilet Oluşturuldu, ID:", newTicketId);

        // 2. Koltuk Sayısını GÜVENLİCE 1 AZALT
        await db.query('UPDATE flights SET seats_available = seats_available - 1 WHERE flight_id = ?', [flight_id]);

        // 3. Detayları Çek
        const [rows] = await db.query(`
            SELECT t.*, f.departure_time, c1.city_name as from_city, c2.city_name as to_city
            FROM tickets t
            INNER JOIN flights f ON t.flight_id = f.flight_id
            INNER JOIN cities c1 ON f.from_city_id = c1.city_id
            INNER JOIN cities c2 ON f.to_city_id = c2.city_id
            WHERE t.ticket_id = ?
        `, [newTicketId]);

        if (rows.length > 0) {
            res.json({ success: true, ticketData: rows[0] });
        } else {
            res.json({
                success: true,
                ticketData: null,
                warning: "JOIN hatası: Şehir veya uçuş bilgileri bulunamadı."
            });
        }

    } catch (err) {
        console.error("!!! SQL HATASI:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Dolu Koltukları Getir
app.get('/api/flights/:flight_id/taken-seats', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT seat_number FROM tickets WHERE flight_id = ? AND seat_number IS NOT NULL',
            [req.params.flight_id]
        );
        res.json(rows.map(row => row.seat_number));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Biletlerimi Listele
app.get('/api/my-tickets/:email', async (req, res) => {
    const userEmail = decodeURIComponent(req.params.email);

    try {
        const [rows] = await db.query(`
            SELECT 
                t.*, 
                f.departure_time, 
                c1.city_name as from_city, 
                c2.city_name as to_city 
            FROM tickets t
            INNER JOIN flights f ON t.flight_id = f.flight_id
            INNER JOIN cities c1 ON f.from_city_id = c1.city_id
            INNER JOIN cities c2 ON f.to_city_id = c2.city_id
            WHERE t.passenger_email = ?
            ORDER BY t.ticket_id DESC
        `, [userEmail]);

        res.json(rows);
    } catch (err) {
        console.error("!!! SQL HATASI:", err.message);
        res.status(500).json({ error: "Sunucu hatası: " + err.message });
    }
});

// Kullanıcı: Bileti İptal Et ve Koltuğu Sınırlar Dahilinde Serbest Bırak
app.delete('/api/tickets/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;

    try {
        const [[ticketData]] = await db.query(`
            SELECT t.flight_id, f.seats_available, f.seats_total 
            FROM tickets t
            JOIN flights f ON t.flight_id = f.flight_id
            WHERE t.ticket_id = ?
        `, [ticket_id]);

        if (!ticketData) {
            return res.status(404).json({ error: "Bilet bulunamadı." });
        }

        const { flight_id, seats_available, seats_total } = ticketData;

        await db.query('DELETE FROM tickets WHERE ticket_id = ?', [ticket_id]);

        if (seats_available < seats_total) {
            await db.query('UPDATE flights SET seats_available = seats_available + 1 WHERE flight_id = ?', [flight_id]);
            console.log(`>>> Bilet #${ticket_id} iptal edildi. SJ-${flight_id} boş koltuk güncellendi.`);
        } else {
            console.log(`>>> Bilet iptal edildi fakat koltuk sayısı zaten maksimum kapasitede (${seats_total}). İşlem durduruldu.`);
        }

        res.json({ message: "Biletiniz başarıyla iptal edildi ve koltuğunuz serbest bırakıldı." });

    } catch (err) {
        console.error("İptal hatası:", err);
        res.status(500).json({ error: "İptal işlemi sırasında bir hata oluştu." });
    }
});

// --- ADMIN ROTALARI ---

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) res.json({ success: true });
        else res.status(401).json({ success: false, message: "Hatalı giriş." });
    } catch (err) {
        res.status(500).json({ error: "Login hatası." });
    }
});

// Admin: Tüm Uçuşları Listele
app.get('/api/admin/flights', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT f.*, c1.city_name as from_city_name, c2.city_name as to_city_name 
            FROM flights f
            JOIN cities c1 ON f.from_city_id = c1.city_id
            JOIN cities c2 ON f.to_city_id = c2.city_id
            ORDER BY f.departure_time DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Uçuşlar getirilemedi." });
    }
});

// Admin: Tüm Biletleri Listele
app.get('/api/admin/tickets', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, f.departure_time, c1.city_name as from_city, c2.city_name as to_city
            FROM tickets t
            LEFT JOIN flights f ON t.flight_id = f.flight_id
            LEFT JOIN cities c1 ON f.from_city_id = c1.city_id
            LEFT JOIN cities c2 ON f.to_city_id = c2.city_id
        `);
        res.json(rows);
    } catch (err) {
        console.error(">>> ADMIN BILET CEKME HATASI:", err.message);
        res.status(500).json({ error: "Bilet listeleme hatası: " + err.message });
    }
});

// Admin: Uçuş Ekle (GEÇMİŞ TARİH VE AYNI ŞEHİR KONTROLLERİ ENTEGRE EDİLDİ)
app.post('/api/flights', async (req, res) => {
    const { flight_id, from_city_id, to_city_id, departure_time, arrival_time, seats_total } = req.body;

    try {
        // GÜVENLİK BARİYERİ 0: Aynı Şehir Engeli
        if (from_city_id == to_city_id) {
            return res.status(400).json({
                error: "Hata: Kalkış ve varış noktası aynı şehir olamaz! Lütfen farklı şehirler seçin."
            });
        }

        // GÜVENLİK BARİYERİ 1: Geçmiş Zaman Engeli
        if (new Date(departure_time) < new Date()) {
            return res.status(400).json({
                error: "Hata: Geçmiş bir tarihe uçak seferi eklenemez! Lütfen gelecekteki bir zamanı seçin."
            });
        }

        // GÜVENLİK BARİYERİ 2: Zaman Yolculuğu Engeli
        if (new Date(arrival_time) <= new Date(departure_time)) {
            return res.status(400).json({
                error: "Hata: İniş zamanı, kalkış zamanından önce veya aynı olamaz!"
            });
        }

        // Hava Trafik Çakışma Kontrolleri
        const [depConflict] = await db.query(
            "SELECT * FROM flights WHERE from_city_id = ? AND DATE_FORMAT(departure_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(?, '%Y-%m-%d %H:%i')",
            [from_city_id, departure_time]
        );
        if (depConflict.length > 0) {
            return res.status(400).json({ error: "Hava trafiği uyarısı: Bu şehirden bu dakikada kalkan başka bir uçuş zaten var!" });
        }

        const [arrConflict] = await db.query(
            "SELECT * FROM flights WHERE to_city_id = ? AND DATE_FORMAT(arrival_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(?, '%Y-%m-%d %H:%i')",
            [to_city_id, arrival_time]
        );
        if (arrConflict.length > 0) {
            return res.status(400).json({ error: "Pist dolu! Bu şehre bu dakikada iniş yapan başka bir uçuş var." });
        }

        const [[fromCity]] = await db.query('SELECT * FROM cities WHERE city_id = ?', [from_city_id]);
        const [[toCity]] = await db.query('SELECT * FROM cities WHERE city_id = ?', [to_city_id]);

        if (!fromCity || !toCity) {
            return res.status(404).json({ error: "Seçilen şehirlerden biri veritabanında bulunamadı!" });
        }

        const distance = calculateDistance(fromCity.latitude, fromCity.longitude, toCity.latitude, toCity.longitude);
        const calculatedPrice = 500 + (distance * 1.5);

        await db.query(
            'INSERT INTO flights (flight_id, from_city_id, to_city_id, departure_time, arrival_time, price, seats_total, seats_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [flight_id, from_city_id, to_city_id, departure_time, arrival_time, calculatedPrice, seats_total, seats_total]
        );

        res.json({ success: true, message: "Uçuş başarıyla oluşturuldu!" });

    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası: " + err.message });
    }
});

// Admin: Uçuş Sil (SQL TRANSACTION VE KADEMELİ SİLME MİMARİSİNE GEÇİLDİ)
app.delete('/api/flights/:id', async (req, res) => {
    const flightId = req.params.id;
    const connection = await db.getConnection(); 
    
    try {
        await connection.beginTransaction();

        // Uçuşa bağlı bilet alan yolcuları yedekle
        const [tickets] = await connection.query(
            'SELECT passenger_email, passenger_name, passenger_surname FROM tickets WHERE flight_id = ?', 
            [flightId]
        );

        if (tickets.length > 0) {
            console.log(`>>> Uçuşta biletli ${tickets.length} yolcu bulundu. Bağlı tüm biletler iptal ediliyor...`);
            // Önce bağlı biletleri temizle
            await connection.query('DELETE FROM tickets WHERE flight_id = ?', [flightId]);
        }

        // Sonra uçuşun kendisini sil
        await connection.query('DELETE FROM flights WHERE flight_id = ?', [flightId]);

        await connection.commit();
        console.log(`>>> SJ-${flightId} uçuşu ve bağlı biletler güvenle silindi.`);

        res.json({ 
            success: true, 
            message: tickets.length > 0 
                ? `Uçuş başarıyla iptal edildi. Bu uçuşa bilet almış olan ${tickets.length} yolcunun bilet kaydı silindi.`
                : "Uçuş başarıyla veritabanından kaldırıldı.",
            affectedPassengers: tickets 
        });

    } catch (err) {
        await connection.rollback();
        console.error(">>> SQL TRANSACTION HATASI, İŞLEMLER GERİ ALINDI:", err.message);
        res.status(500).json({ error: "Uçuş silme işlemi başarısız oldu, veri bütünlüğü korundu: " + err.message });
    } finally {
        connection.release();
    }
});

// Admin: Uçuş Güncelle (Edit)
app.put('/api/flights/:id', async (req, res) => {
    const flightId = req.params.id;
    const { from_city_id, to_city_id, departure_time, arrival_time, seats_total, seats_available } = req.body;

    try {
        if (new Date(arrival_time) <= new Date(departure_time)) {
            return res.status(400).json({
                error: "Hata: Güncelleme başarısız. İniş zamanı kalkıştan önce veya aynı olamaz!"
            });
        }

        const [[c1]] = await db.query('SELECT * FROM cities WHERE city_id = ?', [from_city_id]);
        const [[c2]] = await db.query('SELECT * FROM cities WHERE city_id = ?', [to_city_id]);

        const dist = calculateDistance(c1.latitude, c1.longitude, c2.latitude, c2.longitude);
        const updatedPrice = 500 + (dist * 1.5);

        await db.query(
            `UPDATE flights 
             SET from_city_id=?, to_city_id=?, departure_time=?, arrival_time=?, price=?, seats_total=?, seats_available=? 
             WHERE flight_id=?`,
            [from_city_id, to_city_id, departure_time, arrival_time, updatedPrice, seats_total, seats_available, flightId]
        );

        res.json({ message: "Uçuş başarıyla güncellendi!" });
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası: Güncelleme yapılamadı." });
    }
});

// Admin Panel: Genel İstatistikleri Getir
app.get('/api/admin/stats', async (req, res) => {
    try {
        const [[{ total_revenue }]] = await db.query(`
            SELECT SUM(f.price) as total_revenue 
            FROM tickets t 
            JOIN flights f ON t.flight_id = f.flight_id
        `);

        const [[{ total_tickets }]] = await db.query('SELECT COUNT(*) as total_tickets FROM tickets');
        const [[{ total_flights }]] = await db.query('SELECT COUNT(*) as total_flights FROM flights');

        const [popularRoute] = await db.query(`
            SELECT c1.city_name as from_city, c2.city_name as to_city, COUNT(t.ticket_id) as sales
            FROM tickets t
            JOIN flights f ON t.flight_id = f.flight_id
            JOIN cities c1 ON f.from_city_id = c1.city_id
            JOIN cities c2 ON f.to_city_id = c2.city_id
            GROUP BY f.from_city_id, f.to_city_id
            ORDER BY sales DESC LIMIT 1
        `);

        res.json({
            revenue: total_revenue || 0,
            tickets: total_tickets,
            flights: total_flights,
            popular: popularRoute[0] || { from_city: '-', to_city: '-', sales: 0 }
        });
    } catch (err) {
        res.status(500).json({ error: "İstatistikler hesaplanamadı." });
    }
});

// --- AUTH ROTALARI ---

// 1. KAYIT OL (REGISTER)
app.post('/api/auth/register', async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
            [name, surname, email, hashedPassword]
        );
        res.json({ success: true, message: "Kayıt başarılı!" });
    } catch (err) {
        res.status(500).json({ success: false, error: "E-posta zaten kayıtlı olabilir." });
    }
});

// 2. GİRİŞ YAP (LOGIN)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: "Kullanıcı bulunamadı." });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: user.user_id, email: user.email, name: user.name, surname: user.surname },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
            
            res.json({ 
                success: true, 
                token, 
                user: { name: user.name, surname: user.surname, email: user.email } 
            });
        } else {
            res.status(401).json({ error: "Şifre hatalı." });
        }
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası: " + err.message });
    }
});

// Sunucu Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
});