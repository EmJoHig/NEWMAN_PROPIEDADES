const router = require('express').Router();
const Propiedad = require('../models/Propiedad');
const Campo = require('../models/Campo');
const nodemailer = require('nodemailer');
//creo las rutas del servidor


router.get('/', async (req, res) => {

    const propiedades =  await Propiedad.find().limit(3).lean();
    const campos =  await Campo.find().limit(3).lean();
    res.render('index', { propiedades, campos });
});


//SEND EMAIL FROM INDEX
router.post("/send-email-form-home", async (req, res) => { 
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
        res.render('index', {
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
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            //para esto, usar variables de entorno 
            auth: {
                user:'administracion@inmobiliarianewman.com',
                pass: '//Newman2021'
            },
            tls: {
                rejectUnauthorized: false //indico que el mail puede enviarse de cualquier servidor, sino no podria mandarlo desde localhost
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

        res.redirect("/");  
    }
});



//db.foo.find().sort({x:1}); 

module.exports = router;