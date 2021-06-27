const mongoose = require('mongoose')
const Grid = require('gridfs-stream')


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

})

const conn = mongoose.createConnection(process.env.MONGODB_URL2);
const gfs = null
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db);
    gfs.collection('uploads');
})
module.exports = exports = mongoose;

//const conn = mongoose.createConnection(process.env.MONGODB_URL)


//module.exports = conn