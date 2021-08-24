const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const router = express.Router()

const connection = mongoose.connection;
let gfs;
connection.once('open', () => {
    // Init stream
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('uploads');
})


router.get('/', function (req, res, next) {
    gfs.files.find().toArray((err, files) => {
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
    })
})

module.exports = router