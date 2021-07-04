const mongoose = require('mongoose')

const Mixed = mongoose.Schema.Types.Mixed;

const programacionSchema = new mongoose.Schema({

    any: Mixed
})

programacionSchema.methods.searchProgramacion = async function () {
    const user = await Programacion.find({}).select('any -_id')
    return user
    //.select('cualquiera.grill.categories -_id')
}

const Programacion = mongoose.model('Programacion', programacionSchema)

module.exports = Programacion