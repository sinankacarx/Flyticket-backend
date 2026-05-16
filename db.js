const mysql = require('mysql2');
require('dotenv').config();

// Veritabanı havuzu (pool) oluşturuyoruz
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise(); // 'async/await' kullanabilmek için