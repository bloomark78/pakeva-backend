var nodemailer = require('nodemailer');
var Mailtime = require('mail-time');
const MongoClient = require('mongodb').MongoClient;
const { conf } = require('./config');
const dbName = 'Pakeva';
var transports = [];
var mailer;


transports.push(nodemailer.createTransport({
	service: 'Outlook365',
	auth: {
		user: 'no-reply@vasster.com',
		pass: 'Fafo2710'
	},
	requireTLS: true,
	tls: { ciphers: 'SSLv3' }
}));

var mailer = null;


const emailServer = async (db) => {
    const mailQueue = new Mailtime({
        db,
        type: 'server',
        strategy: 'balancer',
        transports
    });

    console.log("Servidor de correos PAKEVA iniciado correctamente");

    mailer = mailQueue;
};

const sendPin = async (email,pin) => {
    var mailOptions = {
        from: '"PAKEVA", <no-reply@vasster.com>',
        to: email,
        subject: 'Verificación de Cuenta',
        text: 'Pin de verificación - '+pin
    };
    return mailer.sendMail(mailOptions, (err, info) => {
        if(info){
            return console.log("Correo enviado");
        }
        else{
            console.log("Error al enviar correo");
        }
    });
};


module.exports = {
    sendPin,
    emailServer
};
