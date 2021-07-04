const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', auth, function (req, res, next) {
    
    
    res.render('admin.pug', { title: 'Radio Nuevo Tiempo' });
})

module.exports = router