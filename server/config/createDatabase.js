const mysql = require('mysql2/promise');

// Create DB in MySQL.
module.exports = async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        })
        connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        console.log(`Database ${process.env.DB_NAME} successfully created or already exist.`);
    } catch (err) {
        console.error(err);
        res.json({ message: err.message });
    };
};