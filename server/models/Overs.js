const { Sequelize } = require('sequelize');

const database = require('../config/initializeDatabase');

const Overs = database.define('overs', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },

    title: {
        type: Sequelize.STRING,
    },

    link: {
        type: Sequelize.STRING,
    },

    image: {
        type: Sequelize.STRING,
    },

    text: {
        type: Sequelize.TEXT,
    },
});

module.exports = Overs;