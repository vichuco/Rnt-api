const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router()


router.get('/', function (req, res, next) {
    /*gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('audio.ejs', { files: false });
        } else {
            files.map(file => {
                if (
                    file.contentType === 'video/mp4'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.render('audio.ejs', { files: files });
        }
    })*/
    res.render('audio.ejs', { files: false });
})

module.exports = router