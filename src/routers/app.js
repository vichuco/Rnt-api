
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/* GET para obtener la página con las funcionalidades de la API */
router.get('/', function(req, res, next) {
    res.render('index.pug', { title: 'CSR Storage'});
});

module.exports = router;