const mongoose = require('mongoose')

const Mixed = mongoose.Schema.Types.Mixed;
const archivoSchema = new mongoose.Schema({

    cualquiera: Mixed 
})

const Archivo = mongoose.model('Archivo', archivoSchema)

module.exports = Archivo