const { Schema, model } = require('mongoose');

const ProfileSchema = Schema({
    id_auth: { type: Schema.Types.ObjectId, ref: 'Auth', required: [true,'El id de autenticación es obligatorio'] },
    name: { type: String, required: [true, 'El nombre de la persona es obligatorio'] },
    surnames: { type: String, required: [true, 'Los apellidos de la persona son obligatorios'] },
    cellphone: { type: String, required: [true, 'El numero de telefono de la persona es obligatorio'] },
    gender: { type: String, enum: ['Masculino','Femenino'], required: [true,'El genero de la persona es obligatorio']},
    customerID: {type: String, default: null},
    latitude: { type: String, default: null },
    longitude: { type: String, default: null },
    filename: { type: String, default: null }, 
});


module.exports = model('Profile', ProfileSchema);