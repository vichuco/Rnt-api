const conn = mongoose.createConnection(process.env.MONGODB_URL2);
const gfs = null
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db);
    gfs.collection('uploads');
})
