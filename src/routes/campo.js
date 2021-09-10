const router = require('express').Router();
const Campo = require('../models/Campo');
//mail
const nodemailer = require('nodemailer'); 

router.get('/compra-campos', async (req, res) => {
    var ObjectId = require('mongodb').ObjectID;
    const campos = await Campo.find({ estadopropiedad: ObjectId("60e9bbda703ed80630487ab3")}).lean();
    res.render('compra-campos', { campos });
});


router.get('/detalle-campo/:_id', async (req, res) => {
    const campo =  await Campo.findById(req.params._id).lean();

    campo.imagen = "data:image/jpg;base64," + campo.imagen;
    res.render('detalle-campo', { campo });
});


//SEND EMAIL FROM DETALLE
router.post("/send-email-campo/:_id", async (req, res) => {
    const campo =  await Campo.findById(req.params._id).lean();

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
        campo.imagen = "data:image/jpg;base64," + campo.imagen;
        res.render('detalle-campo', {
            campo,
            errors,
            name,
            email,
            message
        });
    }
    else{

        const { nombre, direccion, descripcion, precio, estadopropiedad} = campo;

        contentHTML = `
            <h2> ${nombre}</h2>
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
                pass: '//Newman2021'
            }, 
            tls: {
                rejectUnauthorized: false //indo que el mail puede enviarse de cualquier servidor, sino no podria mandarlo desde localhost
            }
        });

        const info = await transporter.sendMail({
            from: "'Newman Group' <administracion@inmobiliarianewman.com>",
            to: 'newmaninmobiliaria@gmail.com',
            subject: 'CONSULTA CAMPO',
            html: contentHTML
        });

        // seteo el mensaje de success
        req.flash('success_msg', 'El mail ha sido enviado!');
        
        res.redirect("/detalle-campo/"+campo._id);  
    }

});

module.exports = router;