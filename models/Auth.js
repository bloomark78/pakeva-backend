const { Schema, model } = require('mongoose');

const AuthSchema = Schema({
    role: { type: Schema.Types.ObjectId, ref: 'Role'}, //Id del tipo de usuario
    email: { type: String, required: [true, 'El email es obligatorio'], unique: true }, //Correo electronico de usuario
    password: { type: String, required: [true, 'La contraseña es obligatoria'] }, //Contraseña de usuario
    verified: { type: Boolean, default: false }, //La cuenta del usuario esta verificada
    access: { type: Boolean, default: true }, //Si el usuario tiene acceso al sistema o esta bloquedad su cuenta
    status: { type: Boolean, default: true }, //Si el usuario repartidor esta activo para envios metropolitanos
    push_id: { type: String, deafult: null} //ID del dispositivo para enviar las notificaciones
});

AuthSchema.methods.toJSON = function() {
    const { __v, password, ...auth } = this.toObject();
    return auth;
};


module.exports = model('Auth', AuthSchema);