const stripe = require('stripe')('sk_test_51ILyf0ByNWUiwSMz3gVgl74KF9O2USGerNglTDgAhjLjERUX4QkJSBvFZw0iBLfYcDUQFsuPEMeRWJiy5sLkCuIo00tfzSvJFz');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const gpc = require('generate-pincode');
const { generateJWT } = require('../helpers/index');
const { sendPin } = require('../utilities/mails/index');

//modelos de BD
const Auth = require('../models/Auth');
const Role = require('../models/Role');
const Profile = require('../models/Profile');


//Mensajes predeterminados
var errorServer = "Error de servidor";

//Funciones
const Login = async(req, res = response) => {
    const {email, password} = req.body;
    try{
        const usuario = await Auth.findOne({ email });
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.json({
                msg: 'Contraseña incorrecta',
                status: false
            });
        }
        
        const token = await generateJWT(usuario._id);
        
        res.json({
            msg: 'Sesion iniciada correctamente',
            token,
            status: true
        });
    }
    catch(err){
        console.log("Error de login ------> ",err);
        return res.status(500).json({
            msg: `${errorServer} al validar las credenciales`,
            status: false
        });
    }
};

const Registro = async (req, res = response) => {
    const { email, password, ...resto} = req.body;
    const pin = gpc(4);
    try{
        //Encriptacion de contraseña
        const salt = bcrypt.genSaltSync(12);
        const passwordf = bcrypt.hashSync(password, salt);

        const rol = await Role.findOne({role: resto.role});

        const auth = new Auth({
            role: rol._id,
            email: email,
            password: passwordf,
            push_id: resto.push_id
        });
        
        // Obtener el id de Stripe para las transacciones
        const {id} = await stripe.customers.create({
            name: `${resto.name} ${resto.AP_P} ${resto.AP_M}`,
            email: email,
        });

        const user = await new Profile({
            id_auth: auth._id,
            name: resto.name,
            surnames: `${resto.ap_p} ${resto.ap_m}`,
            cellphone: resto.cellphone,
            gender: resto.gender,
        });

        user.customerID = id;

        await auth.save();
        await user.save();

        if(!resto.push_id){
            console.log("No tiene id para push, enviar correo electronico");
            await sendPin(email,pin);
            return res.json({
                msg: 'Usuario registrado de manera exitosa',
                email,
                pin,
                status: true
            });
        }

        await pinPush(pin,auth.email,auth.push_id);

        return res.json({
            msg: 'Usuario registrado con exito!',
            email,
            pin,
            status: true
        });
    }
    catch(err){
        console.log("err -------> ",err);
        return res.json({
            msg: `${errorServer} al registrar usuario`,
            status: false
        });
    }  
};

const Verificar = async (req, res = response) => {
    const { email } = req.body;
    try{
        const usuario = await Auth.findOneAndUpdate({email},{
            $set: {
                verified: true
            }
        });
        
        const token = await generateJWT(usuario._id);

        return res.json({
            msg: 'Cuenta verificada',
            status: true,
            token
        });
    }
    catch(err){
        console.log("Error al verificar la cuenta ------> ",err);
        return res.status(500).json({
            msg: `${errorServer} al verificar la cuenta`,
            status: false
        });
    }
};

const VerificaToken = async (req, res = response) => {
    try{
        const usuario = req.usuario;

        return res.json({
            status: true,
            usuario
        });
    }
    catch(err){
        return res.status(500).json({
            msg: `${errorServer} al verificar el token del usuario`,
            status: false
        });
    }
};

module.exports = {
    Login,
    Registro,
    Verificar,
    VerificaToken
};