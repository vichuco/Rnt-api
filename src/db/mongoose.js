const mongoose = require('mongoose')
const Grid = require('gridfs-stream')

const conn= mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

})
//const conn = mongoose.createConnection(process.env.MONGODB_URL);
conn.once('open', () => {
    // Init stream
    const gfs = Grid(conn.db);
    gfs.collection('uploads');
    
})

