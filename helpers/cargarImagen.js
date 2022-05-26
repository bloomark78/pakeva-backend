const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const subirArchivo = ( files, extensionesValidas = ['png','jpeg', 'jpg', 'gif'], carpeta = '' ) => {
    
    return new Promise((resolve, reject) => {
        const { foto } = files;
        const nombreCortado = foto.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        if(!extensionesValidas.includes(extension)){
            return reject(`El archivo ${foto.name} no es un formato de archivo valido`);
        }
        
        const nombreTemp = uuidv4() + '.'+extension;
    
        const uploadPath = path.join(__dirname, '../uploads', carpeta ,nombreTemp);
    
        foto.mv( uploadPath, (err) => {
            if(err){
                reject('Error de servidor, contacte al administrador');
            }

            resolve(nombreTemp);
        });
    });

};

const obtenerFoto = ( img, carpeta ) => {

    const pathFoto = path.resolve(__dirname, '../uploads', carpeta, img);

    const existe = fs.existsSync(pathFoto);

    if(!existe){
        return path.resolve(__dirname, '../assets/logo.png');
    }

    return pathFoto;
};

const EliminarFoto = (img, carpeta) => {
    const pathFoto = path.resolve(__dirname, '../uploads', carpeta, img);

    const existe = fs.existsSync(pathFoto);

    if(existe){
        fs.unlinkSync(pathFoto);
        return true;
    }
};


module.exports = {
    subirArchivo,
    obtenerFoto,
    EliminarFoto
};