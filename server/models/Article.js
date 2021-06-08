const { Sequelize } = require('sequelize');

const database = require('../config/initializeDatabase');

const Article = database.define('article', {
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

module.exports = Article;