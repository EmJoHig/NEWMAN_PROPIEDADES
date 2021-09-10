const mongoose = require('mongoose');
const { Schema } = mongoose;

const PropiedadSchema = new Schema({
    codigo: {type: String, required: true},
    descripcion: {type: String, required: true},
});

module.exports = mongoose.model('estadoPropiedade', PropiedadSchema)