const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const indexRouter = require('./routers/app')
const loginRouter = require('./routers/login')
const adminRouter = require('./routers/admin')
const uploadRouter = require('./routers/upload')
const podcastRouter = require('./routers/podcast')
const userApi = require('./routers/api')
const cookieParser  = require('cookie-parser')
const session = require('express-session')
const app = express()
app.use(session({ resave: false, saveUninitialized: false, secret: '123456789' }))
//const http = require('http')
//const nconf = require('nconf')

const methodOverride = require('method-override')

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.use(function (req, res, next) {
    if(!req.session.userInfo && (req.path === '/upload'  || req.path === '/login' || req.path === '/admin' || req.path === '/podcast'  ) && req.method === 'GET') {
        res.redirect('/');
    } 
    //else if(req.path === '/logout' && req.method === 'POST'){
        //res.redirect('/');
    //}
    //else if(req.session.userInfo && (req.path === '/login' ), req.method === 'POST' ) {
      //  res.redirect('/upload');
    //}
    else {
        next();
    }
});

app.use('/app', indexRouter)

const port = process.env.PORT
app.use(methodOverride('_method'))
app.use(express.json())
app.use(cookieParser());
app.use(userApi)
app.use(userRouter)
app.use('/login', loginRouter)
app.use('/upload', uploadRouter)
app.use('/podcast', podcastRouter)
app.use('/admin', adminRouter)

//app.use(userApi)
app.use(express.urlencoded({ extended: false }));




const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../views')

app.set('views', viewsPath)
app.set('view engine', 'pug')
app.set('view engine', 'ejs')

app.use(express.static(publicDirectoryPath))



app.listen(port, () => {
    console.log('Server is up on port .'+ port)
})
