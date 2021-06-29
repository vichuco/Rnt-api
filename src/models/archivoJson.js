const mongoose = require('mongoose')
const categories = "categories"
const Mixed = mongoose.Schema.Types.Mixed;
const archivoSchema = new mongoose.Schema({

    cualquiera: Mixed
})

archivoSchema.methods.searchJson = async function () {
    const user = await Archivo.find({categories})

    return user
}

const Archivo = mongoose.model('Archivo', archivoSchema)

module.exports = Archivos