const mongoose = require('mongoose')
const Grid = require('gridfs-stream')


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

})

const conn = mongoose.createConnection(process.env.MONGODB_URL);
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db);
    gfs.collection('uploads');
    
})

//const conn = mongoose.createConnection(process.env.MONGODB_URL)


//module.exports = conn