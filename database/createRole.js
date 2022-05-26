const bcrypt = require('bcryptjs');

const Role = require('../models/Role');
const Auth = require('../models/Auth');
const Profile = require('../models/Profile');


const crear = async () => {
    const roles = await Role.find().countDocuments();
    
    if(roles > 0){
        return;
    }

    await new Role({
        role: 'Administrador'
    }).save();
    await new Role({
        role: 'Usuario'
    }).save();
    await new Role({
        role: 'Repartidor'
    }).save();
    
    return;
};

const crearAdmin = async () => {
    const admin = await Auth.exists({email: 'jgarza@pakeva.net'});
    const rol = await Role.findOne({ role: 'Administrador'});

    if(admin){
        return;
    }

    const salt = bcrypt.genSaltSync(12);
    const password = bcrypt.hashSync('pakeva123', salt);

    const auth = await new Auth({
        role: rol._id,
        email: 'jgarza@pakeva.net',
        password: password,
        verified: true
    }).save();

    await new Profile({
        id_auth: auth._id,
        name: 'Julio',
        surnames: 'Garza',
        cellphone: '8120640586',
        gender: 'Masculino'
    }).save();

    return;
};


module.exports = {
    crear,
    crearAdmin
};