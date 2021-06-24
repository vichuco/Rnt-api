const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
Grid.mongo = mongoose.mongo;

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

})
const db = mongoose.connection;
db.once('open', function() {
    gfs = Grid(conn.db);
    gfs.collection('uploads');
  });

//const conn = mongoose.createConnection(process.env.MONGODB_URL)


//module.exports = conn