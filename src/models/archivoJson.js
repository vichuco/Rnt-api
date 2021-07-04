const mongoose = require('mongoose')

const Mixed = mongoose.Schema.Types.Mixed;

const archivoSchema = new mongoose.Schema({

    cualquiera: Mixed
})

archivoSchema.methods.searchJson = async function () {
    const user = await Archivo.find({}).select('cualquiera -_id')
    return user
    //.select('cualquiera.grill.categories -_id')
}

const Archivo = mongoose.model('Archivo', archivoSchema)

module.exports = Archivo