const mongoose = require('mongoose')

const archivoSchema = new mongoose.Schema({

    cualquiera: Schema.Types.Mixed
})

const Archivo = mongoose.model('Jsons', archivoSchema)

module.exports = Archivo