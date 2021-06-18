const conn = mongoose.createConnection(process.env.MONGODB_URL);
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    
})