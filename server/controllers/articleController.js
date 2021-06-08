const Article = require('../models/Article');

// Get full list of products.
const articlesGet = async (req, res) => {
    try {
        const articles = await Article.findAll();
        console.log(articles);
        res.json(articles);
    } catch (err) {
        console.error(err);
        res.json({ message: err.message });
    };
};

module.exports = {
    articlesGet,
};