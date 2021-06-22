const mongoose = require('mongoose')
const conn = mongoose.createConnection(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
conn.once('open', () => {
    // Init stream
    const gfs = Grid(conn.db);
    gfs.collection('uploads');
    
})

/*mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useMongoClient: true

})*/

/*const conn = mongoose.connection
const gfs = null
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db);
    gfs.collection('uploads');
})*/
