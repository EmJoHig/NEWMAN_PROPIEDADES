const router = require('express').Router();
const Propiedad = require('../models/Propiedad');
const Campo = require('../models/Campo');
const EstadoPropiedad = require('../models/EstadoPropiedad');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app  = express();
const bodyParser = require('body-parser');
const mime = require('mime');
//mail
const nodemailer = require('nodemailer'); 
//handlebars
const Handlebars = require('handlebars')

const storageMulter = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads') ,
    filename: (req, file, cb) =>{
        cb(null, uuidv4() + path.extname(file.originalname)//lo guardo con el id autogerado y concateno la extencion del archivo 
        .toLocaleLowerCase());
    }//como voy a colocar el nombre de las imgs que suba
});

app.use(express.urlencoded({extended:false}));
app.use(express.json());

//creo las rutas del servidor

//DESCOMENTAR CUANDO HAYA PROPIEDADES EN ALQUILER
router.get('/alquiler', async (req, res) => {
    var ObjectId = require('mongodb').ObjectID;
    const propiedades = await Propiedad.find({ estadopropiedad: ObjectId("60e9bbd5703ed80630487ab2")}).lean();
    res.render('alquiler', { propiedades });
});

router.get('/compra', async (req, res) => {
    var ObjectId = require('mongodb').ObjectID;
    //const propiedades = await Propiedad.find({ estadopropiedad: { $in: [ 5, ObjectId("60e9bbda703ed80630487ab3") ] } }).lean();
    const propiedades = await Propiedad.find({ estadopropiedad: ObjectId("60e9bbda703ed80630487ab3")}).lean();

    res.render('compra', { propiedades });
});

 
router.get('/detalle/:_id', async (req, res) => {
    const propiedad =  await Propiedad.findById(req.params._id).lean();

    // propiedad.imagen = "data:image/jpg;base64," + propiedad.imagen;
    res.render('detalle', { propiedad });
});


//alta de propiedad
router.get('/nueva', (req, res) => {
    res.render("new-property");
});


//debo definir donde voy a colocar la imagen que subo
const uploadimage = multer({
    storage: storageMulter,
    // limits: { fileSize: 17825796 },
    dest: path.join(__dirname, '..public/uploads'),
    fileFilter: (req, file, cb) => {//file es el objeto que tinene todos los datos de la imagen como mimetype: image/png 
        const filetypes = /jpeg|png|jpg|gif|mp4/;
        const mimetype = filetypes.test(file.mimetype);//compruebo que el valor de file.mimetype coincida con los que tiene la var filetypes
        const extname = filetypes.test(path.extname(file.originalname));//con path.extname obtengo la extencion que tiene el valor file.originalname

        if (mimetype && extname){
            return cb(null,true);
        }
        cb("Error: El archivo debe tener una imagen válida.");
    }
}).array('imagenes'); //image porque es el mismo nombre que tiene el input en su propiedad name del form de alta




router.post("/propiedad/nueva", uploadimage, async (req, res) => {

    const {nombre, direccion, moneda, precio, descripcion, tipopropiedad, banos, dormitorios, superficie, cocheras} = req.body;
    if (nombre != '' && direccion != '' && moneda != '' && precio != '' &&  descripcion != '' && tipopropiedad != ''){

        var fs = require('fs');
        // convierto la imagen en base 64
        // let binaryData = fs.readFileSync(req.file.path);
        // var base64String = new Buffer.from(binaryData).toString("base64");

        let estadoPropiedad = await EstadoPropiedad.findOne({ codigo: 'V' }).lean();
        
        // console.log('req.body');
        const imagenes = [];
        const videos = [];
        req.files.forEach(element => {
            let binaryData = fs.readFileSync(element.path);
            var base64String = new Buffer.from(binaryData).toString("base64");

            if (path.extname(element.originalname) == '.mp4'){
                // console.log('es video');
                videos.push(base64String);
            } else{
                // console.log('no es video');
                imagenes.push(base64String);
            }
        });
        if (tipopropiedad == 'P' || tipopropiedad == 'p'){
            const nuevaPropiedad = new Propiedad({ nombre, direccion, moneda, precio, descripcion, tipopropiedad, banos, dormitorios, superficie, cocheras });
            nuevaPropiedad.estadopropiedad = estadoPropiedad._id;
            nuevaPropiedad.imagenes = imagenes;
            if (videos.length > 0 && videos.length == 1){
                nuevaPropiedad.video = videos;
            }
            await nuevaPropiedad.save();
        } else if (tipopropiedad == 'C' || tipopropiedad == 'c') {
            const nuevaPropiedad = new Campo({ nombre, direccion, moneda, precio, descripcion, tipopropiedad });
            nuevaPropiedad.estadopropiedad = estadoPropiedad._id;

            if (imagenes.length > 0){
                nuevaPropiedad.imagen = imagenes;
            } 

            if (videos.length > 0 && videos.length == 1){
                nuevaPropiedad.video = videos;
            }
            await nuevaPropiedad.save();
        }
    }else{
        console.log('CAMPOS INCOMPLETOS');
    }
    
    res.redirect("/nueva");  
});


//SEND EMAIL FROM DETALLE
router.post("/send-email-propiedad/:_id", async (req, res) => {
    const propiedad =  await Propiedad.findById(req.params._id).lean();

    const {name, email, message} = req.body;

    const errors = [];

    if (!name){
        errors.push({text: 'Ingrese un nombre'});
    }
    if (!email){
        errors.push({text: 'Ingrese un email'});
    }
    if (!message){
        errors.push({text: 'Ingrese un mensaje'});
    }

    if (errors.length > 0){
        propiedad.imagen = "data:image/jpg;base64," + propiedad.imagen;
        res.render('detalle', {
            propiedad,
            errors,
            name,
            email,
            message
        });
    }
    else{

        const { nombre, direccion, descripcion, precio, estadopropiedad} = propiedad;

        contentHTML = `
            <h2> ${nombre}</h2>
            <h3 style='font-weight: bold;'>Nombre: <span style='font-weight: normal;'>${name}</span><h3/> 
            <h3 style='font-weight: bold;'>Email: <span style='font-weight: normal;'>${email}</span><h3/>
            <p>${message}</p>
        `;

        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            //para esto, usar variables de entorno 
            auth: {
                user:'administracion@inmobiliarianewman.com',
                pass: '//Newman2121'
            },
            tls: {
                rejectUnauthorized: false //indo que el mail puede enviarse de cualquier servidor, sino no podria mandarlo desde localhost
            }
        });
        
        const info = await transporter.sendMail({
            from: "'Newman Group' <administracion@inmobiliarianewman.com>",
            to: 'newmaninmobiliaria@gmail.com',
            subject: 'CONSULTA PROPIEDAD',
            html: contentHTML
        });
        // seteo el mensaje de success
        req.flash('success_msg', 'El mail ha sido enviado!');
        
        res.redirect("/detalle/"+propiedad._id);  
    }

});



//SEND EMAIL FROM VIEW CONTACT
router.post("/send-email-contact", async (req, res) => {
    const {name, email, message} = req.body;

    const errors = [];

    if (!name){
        errors.push({text: 'Ingrese un nombre'});
    }
    if (!email){
        errors.push({text: 'Ingrese un email'});
    }
    if (!message){
        errors.push({text: 'Ingrese un mensaje'});
    }

    if (errors.length > 0){
        res.render('contacto', {
            errors,
            name,
            email,
            message
        });
    }
    else{

        contentHTML = `
            <h3 style='font-weight: bold;'>Nombre: <span style='font-weight: normal;'>${name}</span><h3/> 
            <h3 style='font-weight: bold;'>Email: <span style='font-weight: normal;'>${email}</span><h3/>
            <p>${message}</p>
        `;

        const transporter = nodemailer.createTransport({
            host:'smtp.hostinger.com',
            port:465,
            secure: true,
            //para esto, usar variables de entorno 
            auth: {
                user:'administracion@inmobiliarianewman.com',
                pass: '//Newman2121'
            },
            tls: {
                rejectUnauthorized: false //indo que el mail puede enviarse de cualquier servidor, sino no podria mandarlo desde localhost
            }
        });

        const info = await transporter.sendMail({
            from: "'Newman Group' <administracion@inmobiliarianewman.com>",
            to: 'newmaninmobiliaria@gmail.com',
            subject: 'CONSULTA DE USUARIO',
            html: contentHTML
        });

        // seteo el mensaje de success
        req.flash('success_msg', 'El mail ha sido enviado!');

        res.redirect("contacto");  
    }
});


//CONTACTO
router.get('/contacto', (req, res) => {
    res.render("contacto");
});

//HELPER DE HANDLEBARS PARA USAR LOS EQUALS EN LOS IF, VER EJEMPLO EN DETALLE PROPIEDAD
Handlebars.registerHelper('eq', function () {
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return args[0] === expression;
    });
});


module.exports = router;