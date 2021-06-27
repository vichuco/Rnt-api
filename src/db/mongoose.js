const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

})



//const conn = mongoose.createConnection(process.env.MONGODB_URL)


//module.exports = conn