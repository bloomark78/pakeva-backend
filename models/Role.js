const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    role: { type: String, required: [true, 'El nombre del rol de usuario es obligatorio']}, //Tipo de usuario
});

module.exports = model('Role', RoleSchema);