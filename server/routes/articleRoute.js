const { Router } = require('express');
const { articlesGet } = require('../controllers/articleController');

const router = Router();

router.get('/', articlesGet);

module.exports = router;