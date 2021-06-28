const mongoose = require('mongoose')



/*const conn = mongoose.createConnection(process.env.MONGODB_URL);
conn.once('open', () => {
    // Init stream
    gfs =  Grid("radio-nt-api", mongoose.mongo);
    gfs.collection('uploads');
})*/

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})


/*mongoose.connect(process.env.MONGODB_URL,
{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=>{ return gfs;
 })
.catch(err => console.log("Could not connect",err))*/

/*mongoose.connect(process.env.MONGODB_URL,
{ useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false })
.then(()=>{ return gfs;
 })
.catch(err => console.log("Could not connect",err))*/


