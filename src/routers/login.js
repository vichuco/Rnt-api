const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router()


router.get('/', function (req, res, next) {
    res.render('admin.pug', { title: 'Radio Nuevo Tiempo' });
})

module.exports = router