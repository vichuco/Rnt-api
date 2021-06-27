const mongoose = require('mongoose')
const Grid = require('gridfs-stream')

const conn = mongoose.createConnection(process.env.MONGODB_URL2);

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db);
    gfs.collection('uploads');
})
module.exports = conn