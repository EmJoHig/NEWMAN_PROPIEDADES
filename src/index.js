const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

//inicializadores
var app = express();
require('./database');

// Settings 
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'));// le defino a node donde esta la carpeta views
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


// middlewars  
//funcioens que van a ser ejecutadas antes de llegar al servidor
app.use(express.urlencoded({extended: false})); //sirve para que cuando me envien un determinado dato, yo pueda entenderlo. Ej si un usuario se registra, quiero recibir el nombre y contraseña
app.use(methodOverride('_method')); // para qeu los formularios envien ademas de post y get, tambien put y delete
app.use(session({ //almaceno los datos del usuario ocultandolos temporalmnemte
    secret: 'exodia',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());


//Global variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');

    next();
});


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/propiedad'));
app.use(require('./routes/campo'));
app.use(require('./routes/users'));


//Statiic Files
app.use(express.static(path.join(__dirname, 'public')));


//Server is Listeninig 
var port = process.env.PORT || 3000;
app.listen(port);
console.log(port);
// app.listen(app.get('´port'), () => {
//     console.log('Server on Port', app.get('´port'));
// })