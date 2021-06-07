const { Sequelize } = require('sequelize');

const database = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    define: {
        timestamps: false,
    },
});

module.exports = database;