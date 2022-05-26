const validarjwt = require('../middlewares/validar-jwt');
const validarCampos = require('../middlewares/validar-campos');
const validaRoles = require('../middlewares/validar-role');

module.exports = {
    ...validarCampos,
    ...validaRoles,
    ...validarjwt
};