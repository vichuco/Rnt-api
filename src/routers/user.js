const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const bodyParser = require('body-parser')
const multer = require('multer')
const xlsxj = require("xlsx-to-json");
const auth = require('../middleware/auth')
const http = require('http')
const fs = require('fs')
const crypto = require('crypto')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const path = require('path')
const iconvlite = require('iconv-lite')
//const mongoose = require('./db/mongoose')
const mongoose = require('mongoose')
const rimraf = require("rimraf")
const fetch = require("node-fetch")
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const port = process.env.PORT || 3000
const conn = mongoose.createConnection(process.env.MONGODB_URL2);



//const conn = mongoose.createConnection(process.env.MONGODB_URL);

/*const conn = mongoose.connection
const gfs = null
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db);
    gfs.collection('uploads');
})*/
/*const conn = mongoose.connection;
conn.once('open', function() {
    gfs = Grid(conn.db);
    gfs.collection('uploads');
  });*/


// Multer para la base de datos
const storage = new GridFsStorage({
    url: process.env.MONGODB_URL2,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                nombre = file.originalname;
                const filename = file.originalname
                //const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });
/*const conn = mongoose.createConnection(process.env.MONGODB_URL);
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db);
    gfs.collection('uploads');
    
})*/


//Multer para los audios

const audioStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const audios = 'public/audios';
        if (!fs.existsSync(audios)) {
            fs.mkdirSync(audios);
        }
        cb(null, audios);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const audioUpload = multer({
    storage: audioStorage
})


router.get('/', function (req, res, next) {
    res.render('login.pug', { title: 'Radio Nuevo Tiempo' });
});

router.post('/users', urlencodedParser, async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        //res.cookie('authcookie', token, { maxAge: 90000, httpOnly: true })
        req.session.user = user
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', urlencodedParser, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        req.session.userInfo = user
        const token = await user.generateAuthToken()
        res.cookie('authcookie', token, { maxAge: 900000, httpOnly: true })
       // res.render('audio.ejs', { files: false });
        //res.send({ user, token })
        /*res.send({valid: true})-- aqui comentar*/
        //res.render('admin', { title: 'Radio Nuevo Tiempo'})
        //res.send({ user, token })
        // res.setHeader('Authorization', 'Bearer '+ token)
        //req.session.userInfo = ({ token  })
        conn.once('open', () => {
            // Init stream
            gfs = Grid(conn.db);
            gfs.collection('uploads');
            
        
            gfs.find().toArray((err, files) => {
                // Check if files
                if (!files || files.length === 0) {
                    res.render('audio.ejs', { files: false });
                } else {
                    files.map(file => {
                        if (
                            file.contentType === 'video/mp4'
                        ) {
                            file.isImage = true;
                        } else {
                            file.isImage = false;
                        }
                    });
                    res.render('audio.ejs', { files: files });
                }
            })
        })


       
    } catch (e) {
        res.status(400).send("usuario o contrasena incorrectas")
    }
})


router.post('/upload', auth, upload.single('file'), (req, res) => {
    xlsActual = false
    xlsSiguiente = false
    const path = "public/xls/"
    // Comprobamos si hay parrilla de semana actual y semana siguiente guardadas en el servidor para luego mostrarlo en el front
    if (fs.existsSync(path + "semana_actual.xlsx")) xlsActual = true
    if (fs.existsSync(path + "semana_siguiente.xlsx")) xlsSiguiente = true

    gfs.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            //return res.status(404).json({
            //err: 'No files exist'
            //res.render('admin.pug', { title: 'Radio Nuevo Tiempo', xlsActual: xlsActual, xlsSiguiente: xlsSiguiente });
            res.render('audio.ejs', { files: false });

        } else {
            files.map(file => {
                if (
                    file.contentType === 'video/mp4'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            })

            const audios = "public/audios/"
            if (!fs.existsSync(audios)) {
                fs.mkdirSync(audios);
            }
            files.forEach(file => {

                fetch('/sound/' + file.filename)
                    .then(res => {
                        const dest = fs.createWriteStream(audios + file.filename)
                        res.body.pipe(dest)
                    })



            });
            const grill = {
                "categories": [
                    {
                        "name": "videos",
                        "mp4": "https://andres-rnt-api.herokuapp.com/",
                        "images": "https://andres-rnt-api.herokuapp.com/",
                        "videos": []
                    }
                ]
            }
            files.forEach(file => {
                let saved = true;

                if (file._id !== '') {
                    let mediaType = "videos/mp4"
                    const mp4Json = {
                        "subtitle": "Fusce id nisi turpis. Praesent viverra bibendum semper. Donec tristique, orci sed semper lacinia, quam erat rhoncus massa, non congue tellus est quis tellus",
                        "sources": [
                            {
                                "type": "mp4",
                                "mime": mediaType,
                                "url": "sound/" + file.filename
                            }
                        ],
                        //"image": "/p/106/thumbnail/entry_id/" + element.ID + "/width/480/height/200",
                        "thumb": "thumbnails/headphones-480x270.png",
                        "image-480x270": "thumbnails/headphones-480x270.png",
                        "image-780x1200": "thumbnails/headphones-780x1200.png",
                        "title": file.filename,
                        "studio": "RNT",
                        "duration": parseInt(file.length) || 0,
                    }
                    grill.categories[0].videos.push(mp4Json);

                    const path = 'public/podcast/podcast.json'
                    try {
                        // Si aun no existe el directorio /jsons debe crearse antes de guardar el archivo de la parrilla
                        if (!fs.existsSync('public/podcast/')) {
                            fs.mkdirSync('public/podcast/');
                            const str = iconvlite.encode(JSON.stringify(grill), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                            fs.writeFileSync(path, str);
                        } else {
                            const str = iconvlite.encode(JSON.stringify(grill), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                            fs.writeFileSync(path, str);
                        }
                    } catch (e) {
                        console.log(e);
                        // Si se produce algún error se notifica al front para que muestre una alerta
                        saved = false;
                        //res.send({saved: false, error: e});
                    }

                }

            })


            res.render('audio.ejs', { files: files });
            //fs.rmdirSync("public/audios/", {recursive:true})

        }

        //res.redirect('/upload');
        //res.render('audio.ejs', { files: files });

        //res.render('admin.pug', { title: 'Radio Nuevo Tiempo', xlsActual: xlsActual, xlsSiguiente: xlsSiguiente })
    })

    /*gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            //return res.status(404).json({
            //err: 'No files exist'
            //res.render('admin.pug', { title: 'Radio Nuevo Tiempo', xlsActual: xlsActual, xlsSiguiente: xlsSiguiente });
            res.render('audio.ejs', { files: false });

        } else {
            files.map(file => {
                if (
                    file.contentType === 'video/mp4'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            })

            const audios = "public/audios/"
            if (!fs.existsSync(audios)) {
                fs.mkdirSync(audios);
            }
            files.forEach(file => {

                fetch('/sound/' + file.filename)
                    .then(res => {
                        const dest = fs.createWriteStream(audios + file.filename)
                        res.body.pipe(dest)
                    })



            });
                    const grill = {
                        "categories": [
                            {
                                "name": "videos",
                                "mp4": "https://andres-rnt-api.herokuapp.com/",
                                "images": "https://andres-rnt-api.herokuapp.com/",
                                "videos": []
                            }
                        ]
                    }
                        files.forEach (file => {
                            let saved = true;
                        
                        if (file._id !== '') {
                            let mediaType = "videos/mp4"
                            const mp4Json = {
                                "subtitle": "Fusce id nisi turpis. Praesent viverra bibendum semper. Donec tristique, orci sed semper lacinia, quam erat rhoncus massa, non congue tellus est quis tellus",
                                "sources": [
                                    {
                                        "type": "mp4",
                                        "mime": mediaType,
                                        "url": "sound/" + file.filename
                                    }
                                ],
                                //"image": "/p/106/thumbnail/entry_id/" + element.ID + "/width/480/height/200",
                                "thumb": "thumbnails/headphones-480x270.png",
                                "image-480x270": "thumbnails/headphones-480x270.png",
                                "image-780x1200": "thumbnails/headphones-780x1200.png",
                                "title": file.filename,
                                "studio": "RNT",
                                "duration": parseInt(file.length) || 0,
                            }
                            grill.categories[0].videos.push(mp4Json);

                            const path = 'public/podcast/podcast.json'
                            try {
                                // Si aun no existe el directorio /jsons debe crearse antes de guardar el archivo de la parrilla
                                if (!fs.existsSync('public/podcast/')) {
                                    fs.mkdirSync('public/podcast/');
                                    const str = iconvlite.encode(JSON.stringify(grill), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                                    fs.writeFileSync(path, str);
                                } else {
                                    const str = iconvlite.encode(JSON.stringify(grill), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                                    fs.writeFileSync(path, str);
                                }
                            } catch (e) {
                                console.log(e);
                                // Si se produce algún error se notifica al front para que muestre una alerta
                                saved = false;
                                //res.send({saved: false, error: e});
                            }

                        }

                        })
                    

            res.render('audio.ejs', { files: files });
            //fs.rmdirSync("public/audios/", {recursive:true})

        }

        //res.redirect('/upload');
        //res.render('audio.ejs', { files: files });

        //res.render('admin.pug', { title: 'Radio Nuevo Tiempo', xlsActual: xlsActual, xlsSiguiente: xlsSiguiente })
    })*/

    //res.cookie('authcookie', req.token, { maxAge: 900000, httpOnly: true })


    //res.json({ file: req.file });
    //res.redirect('/');


}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        req.session.destroy()
        //res.send()
        res.render('login.pug', { title: 'Radio Nuevo Tiempo' })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/sound/:filename', (req, res) => {
    Grid.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            })
        }

        // Check if image audio/mpeg
        if (file.contentType === 'video/mp4') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
            //return res.json(file)
        } else {
            res.status(404).json({
                err: 'Not videos'
            })
        }
    })
})

router.get('/json/:filename', (req, res) => {
    Grid.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            })
        }

        // Check if image audio/mpeg
        if (file.contentType === 'video/mp4') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            //readstream.pipe(res);
            return res.json(file)
        } else {
            res.status(404).json({
                err: 'Not sound'
            })
        }
    })
})

// obtener todos los files en formato json
router.get('/files', (req, res) => {
    Grid.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            })
        }

        //const readstream = gfs.createReadStream(files._id);
        //readstream.pipe(res)
        // existe el files
        return res.json(files);

    })
})

router.delete('/files/:id', (req, res) => {
    Grid.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err });
        }
        Grid.files.find().toArray((err, files) => {
            // Check if files audio/mpeg
            if (!files || files.length === 0) {
                res.render('audio.ejs', { files: false });
            } else {
                files.map(file => {
                    if (
                        file.contentType === 'video/mp4'
                    ) {
                        file.isImage = true;
                    } else {
                        file.isImage = false;
                    }
                })

                res.render('audio.ejs', { files: files })
                //fs.rmdirSync("public/audios/", {recursive:true})


            }
        })
        rimraf("public/audios/", function () { console.log("done"); })
        //res.redirect('/login');
        //res.redirect(req.get('referer'))
    })
})

router.post('/audio', audioUpload.single('audio'), function (req, res, next) {
    res.send("Audio guardado correctamente");
    res.end();
})

/*********************funciones ***********************/
/* Multer para subir los ficheros xlsx de la parrilla */
const xlsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const xls = 'public/xls';
        if (!fs.existsSync(xls)) {
            fs.mkdirSync(xls);
        }
        cb(null, xls);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const xlsUpload = multer({
    storage: xlsStorage
})

/* Función que convierte los ficheros xlsx de la parrilla a json para luego tratarlos */
function xlsToJSON(filename, res) {
    const path = 'public/xls/' + filename
    xlsxj({
        input: path,
        output: path.replace(".xlsx", ".json"),
        lowerCaseHeaders: true
    }, function (err, result) {
        if (err) {
            console.error(err)
            res.send({ saved: false, error: err });
        } else {
            JSONtoGrill(result, filename, res);
        }
    })
}

function JSONtoGrill(json, filename, res) {
    let saved = true;
    const grill = {
        "categories": [
            {
                "name": "programas",
                //"images": "https://www.nuevotiempo.org/radio/",
                "studio": "Radio Nuevo Tiempo",
                "files": []
            }
        ]
    }
    json.forEach(element => {
        if (element.ID !== '') {
            const mp4Json = {
                "id": element.ID,
                "titulo": element.Programa,
                "inicio": element.Inicio,
                "fin": element.Fin,
                "descripcion": element.Descripcion,
                "poster": element.Poster,
                "video": "https://andres-rnt-api.herokuapp.com/bibliaFacil.mp4",
            }
            grill.categories[0].files.push(mp4Json);
            const path = 'public/jsons/' + filename.replace(".xlsx", ".json");
            const path2 = 'public/jsons/' + element.Programa.replace(/\s+/g, '') + ".json";
            try {
                // Si aun no existe el directorio /jsons debe crearse antes de guardar el archivo de la parrilla
                if (!fs.existsSync('public/jsons/')) {
                    fs.mkdirSync('public/jsons/');
                    const str2 = iconvlite.encode(JSON.stringify(mp4Json), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                    const str = iconvlite.encode(JSON.stringify(grill), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                    fs.writeFileSync(path, str);
                    fs.writeFileSync(path2, str2);
                } else {
                    const str = iconvlite.encode(JSON.stringify(grill), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                    fs.writeFileSync(path, str);
                    const str2 = iconvlite.encode(JSON.stringify(mp4Json), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                    fs.writeFileSync(path2, str2);
                }
            } catch (e) {
                console.log(e);
                // Si se produce algún error se notifica al front para que muestre una alerta
                saved = false;
                res.send({ saved: false, error: e });
            }
        }
    })
    // En caso de que se haya guardado correctamente el archivo se notifica al front para que muestre la alerta
    if (saved) {
        res.send({ saved: true });
        // res.redirect('/login')
    }

}
/* Función que crea el json que se almacenará y luego se enviará a la aplicación móvil */
/*function JSONtoGrill(json, filename, res) {
    let saved = true;
    const grill = {
        "categories": [
            {
                "name": "videos",
                "mp4": "http://192.168.0.109:3000/",
                "images": "http://192.168.0.109:3000/",
                "videos": []
            }
        ]
    };

    json.forEach(element => {
        
        if( element.ID !=='') {
            //console.log("test")
         fetch('http://localhost:3000/json/'+element.ID).then((response) => {
            response.json().then((data) => {
                console.log(element.ID)
             //   if(element.ID !== '' && element.ID) {
                    //let metadata = JSON.parse(fs.readFileSync('public/jsons/test.json', 'utf8'))
                    //const finaldata = JSON.parse(metadata)
                       // console.log(metadata)
                            let mediaType = "videos/mp4" 
                            //console.log(finaldata)
                              //  if(metadata.filename === element.ID){
                                //data.forEach(elemento =>{
                                     // if(elemento.filename === element.ID){
                                        const mp4Json = {
                                            "subtitle": element.Descripcion || "",
                                            "day": element.Dia || null,
                                            "hour": element.Hora || null,
                                            "sources": [
                                                {
                                                    "type": "mp4",
                                                    "mime": mediaType,
                                                    "url": "audios/"+element.ID
                                                }
                                            ],
                                            //"image": "/p/106/thumbnail/entry_id/" + element.ID + "/width/480/height/200",
                                            "image-480x270": "thumbnails/headphones-480x270.png" ,
                                            "image-780x1200": "thumbnails/headphones-780x1200.png",
                                            "title": data.filename || "",
                                            "studio": "RNT",
                                            "duration": parseInt(data.length) || 0,
                                        }
                                        grill.categories[0].videos.push(mp4Json);
                    
                                        const path = 'public/jsons/' + filename.replace(".xlsx", ".json");
                                        try {
                                            // Si aun no existe el directorio /jsons debe crearse antes de guardar el archivo de la parrilla
                                            if (!fs.existsSync('public/jsons/')) {
                                                fs.mkdirSync('public/jsons/');
                                                const str = iconvlite.encode(JSON.stringify(grill), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                                                fs.writeFileSync(path, str);
                                            } else {
                                                const str = iconvlite.encode(JSON.stringify(grill), 'iso-8859-1'); // Se codifica usando iso-8859-1 para que incluya tanto tildes como ñ
                                                fs.writeFileSync(path, str);
                                            }
                                        } catch (e) {
                                            console.log(e);
                                            // Si se produce algún error se notifica al front para que muestre una alerta
                                            saved = false;
                                            res.send({saved: false, error: e});
                                        }
                                      
                                  
                                    
                                
                                //return file.filename=element.ID
                            
                                                                                                 // corresponde con un vídeo, en cambio si es == 5 corresponde a un audio
                            // Aquí se rellenan los metadatos de cada podcast con los obtenidos en Kaltura además de los introducidos en el fichero xlsx
                
                })
         })
        }   
    });
    // En caso de que se haya guardado correctamente el archivo se notifica al front para que muestre la alerta
    if(saved) {
        //res.send({saved: true});
        res.redirect('/login')
    }
            
}


/* POST para añadir la parrilla de radio */
// Antes de guardar el archivo se debe comprobar si la sesión está iniciada para evitar que se suban archivos sin permiso
router.post('/addgrill', xlsUpload.single('file'), function (req, res) {
    xlsToJSON(req.file.filename, res); // Llamada a función que transforma el xlsx a json
})



module.exports = router