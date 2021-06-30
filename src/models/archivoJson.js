const mongoose = require('mongoose')

const Mixed = mongoose.Schema.Types.Mixed;

const archivoSchema = new mongoose.Schema({

    cualquiera: Mixed
})
archivoSchema.set('toJSON', { getters: true, virtuals: false });
archivoSchema.methods.searchJson = async function () {
    const user = await Archivo.find({})
    const userJson = user.toJSON()
    return userJson
}

const Archivo = mongoose.model('Archivo', archivoSchema)

module.exports = Archivos