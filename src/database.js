const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db-inmobiliaria', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(db => console.log('Conectado a Mongo DB'))
.catch(err => console.log(err))