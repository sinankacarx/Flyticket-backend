const bcrypt = require('bcrypt');
const password = 'admin123'; // Admin panelinde kullanmak istediğin şifre

console.log("Şifre şifreleniyor, lütfen bekleyin...");

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error("Hata:", err);
        return;
    }
    console.log("-----------------------------------------");
    console.log("SENİN HASH'LENMİŞ ŞİFREN:");
    console.log(hash); 
    console.log("-----------------------------------------");
    console.log("Bu yukarıdaki metni kopyala ve MySQL'e yapıştır.");
});