const mongoose = require('mongoose');
const { Schema } = mongoose;

const CampoSchema = new Schema({
    nombre: {type: String, required: true},
    direccion: {type: String, required: true},
    descripcion: {type: String, required: true},
    precio: {type: String, required: true},
    date: {type: Date, default: Date.now},
    // estadopropiedad: {type: String, required: false},
    estadopropiedad: {type: mongoose.Schema.Types.ObjectId, ref: 'estadoPropiedade', required: true},
    imagen: {type: String, required: true },
    imagenessecundarias: {type: [String], required: false},
    video: {type: [String], required: false},
    // tipopropiedad: {type: String, required: true, default: 'CAMPO'},// CAMPO | PROPIEDAD
});

module.exports = mongoose.model('campo', CampoSchema)