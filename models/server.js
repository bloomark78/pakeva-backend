const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const { dbConnection } = require('../database/config'); 
const { emailServer } = require('../utilities/mails/index');
const { crear, crearAdmin } = require('../database/createRole');
const { SocketController } = require('../sockets/controller');

class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3311;

        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        
        this.paths = {
            users: '/api/user',
            auth: '/api/auth',
            admin: '/api/admin',
        };
        
        //Conexión a la base de datos
        dbConnection((con) => {
            emailServer(con.connection.db);
        });
        
        this.crearRoles();
        
        //Iniciar servidor de correos
        // this.serverEmail();
        
        // Middleware
        this.middlewares();
        
        //Rutas de la aplicacion
        this.routes();

        //Sockets
        this.sockets();
    }
    
    async crearRoles() {
        await crear();
        await crearAdmin();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Necesario para poder enviar bien las imagenes con el body
        this.app.use(bodyParser.json());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.admin, require('../routes/admin'));
    }

    sockets(){
        this.io.on('connection', SocketController);
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;