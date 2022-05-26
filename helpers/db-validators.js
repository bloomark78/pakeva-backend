const Role = require('../models/Role');
const Auth = require('../models/Auth');

const roleValido = async(rol = '') => {
    const existRole = await Role.exists({ role: rol });
    if (!existRole) {
        throw new Error(`El tipo de usuario <br> <strong>${rol}</strong><br> no existe`);
    }
};

const existEmail = async(email = '') => {

    const existEmail = await Auth.exists({ email });
    if (existEmail) {
        throw new Error(`El email <br> <strong>${email}</strong> <br>ya esta registrado`);
    }
};

const validEmail = async(email = '') => {
    const existEmail = await Auth.exists({ email });
    if(!existEmail){
        throw new Error(`El email <br> <strong>${email}</strong> <br> No se encuentra en nuestros registros`);
    }
};

const AccountVerified = async (email = '') => {
    const { verified } = await Auth.findOne({email});
    if(!verified){
        throw new Error('Por favor verifica tu cuenta para poder iniciar sesión');
    }
};

const verifiedAccount = async (email = '') => {
    const verificado = await Auth.findOne({email},{verified: 1});
    if(verificado.verified){
        throw new Error('Tu cuenta ya esta verificada<br>Inicia sesion para continuar');
    }
};

module.exports = {
    roleValido,
    existEmail,
    validEmail,
    verifiedAccount,
    AccountVerified
};