const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async(callback) => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Pakeva', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(con => {
        console.log("Conexión a la base de datos de PAKEVA establecida");
        callback(con);
    })
    .catch(err => {
        console.log("Error catch ----------> ",err);
    });
};


module.exports = {
    dbConnection
};