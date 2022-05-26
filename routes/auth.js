const { Router } = require('express');
const { check } = require('express-validator');
const { Login, Registro, Verificar, VerificaToken } = require('../controllers/Auth');
const { validEmail, AccountVerified, existEmail, roleValido, verifiedAccount } = require('../helpers/db-validators');
const { validarCampos, validarjwt } = require('../middlewares/index');

const router = Router();

router.post('/login',[
    check('email').custom(validEmail),
    check('email').custom(AccountVerified),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],Login);

router.post('/registro',[
    check('email').custom(existEmail),
    check('role').custom(roleValido),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],Registro);

router.post('/verificar',[
    check('email').custom(validEmail),
    check('email').custom(verifiedAccount),
    validarCampos
], Verificar);

router.get('/verificaToken',[
    validarjwt
],VerificaToken);

module.exports = router;