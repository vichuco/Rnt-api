const mongoose = require('mongoose')

mongoose.createConnection(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})


