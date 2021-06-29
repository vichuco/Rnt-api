const mongoose = require('mongoose')

const archivoSchema = new Schema({

    cualquiera: Schema.Types.Mixed
})

const Archivo = mongoose.model('Archivo', archivoSchema)

module.exports = Archivo