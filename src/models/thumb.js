const mongoose = require('mongoose')

const thumbSchema = new mongoose.Schema({
    avatar: {
        type: Buffer
    }
})

const Thumb = mongoose.model('Thumb', thumbSchema)

module.exports = Thumb