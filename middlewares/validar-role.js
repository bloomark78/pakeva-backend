const Auth = require('../models/Auth');

const loginActivo = async (req,res,next) => {
    if(!req.usuario){
        return res.status(501).json({
            msg: 'Necesitas estar autenticado, por favor inicia sesión para continuar',
            status: false
        });
    }
};

const isAdmin = async (req, res, next) => {
    const {role} = await Auth.findById(req.usuario.id_auth._id).populate('role');

    if(role.role !== 'Administrador'){
        throw new Error('No tienes suficientes permisos para realizar esta operación');
    }

    next();
};

module.exports = {
    isAdmin,
    loginActivo
};