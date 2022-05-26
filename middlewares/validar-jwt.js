const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');
const Profile =  require('../models/Profile');

const validarjwt = async(req, res, next) => {
    const token = req.header('token-P4k3v4');
    if (!token) {
        return res.status(401).json({
            msg: 'No tienes autorización para acceder a este recurso'
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY || 'V@sst3rD3s4rr0ll3');
        const usuario = await Auth.findById(uid);
        if (!usuario) {
            return res.status(400).json({
                msg: 'Token invalido - Credenciales invalidas'
            });
        }

        const perfil = await Profile.findOne({id_auth: usuario._id}).populate('id_auth');
        req.usuario = perfil;

        return next();
    } catch (err) {
        return res.status(401).json({
            msg: 'El token no es valido'
        });
    }
};

module.exports = {
    validarjwt
};