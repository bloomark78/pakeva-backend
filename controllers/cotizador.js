const { response } = require('express');
const axios = require('axios');

const Cotizar = async (req, res = response) => {
    try{
        var cotizacion = [];
        await ampm(req.body).then(async (resp) => {
            cotizacion = await resp;
        });

        return res.json({
            cotizacion,
            status: true
        });
    }
    catch(err){
        console.log("Error en cotizar --------> ",err);
        return res.status(500).json({
            msg: 'Error al cotizar el envio, intentalo mas tarde',
            status: false
        });
    }
};

function ampm(datos){

    let data = JSON.stringify({
        "Opciones": {
            "TipoEnvio": `${datos.tipo_envio}`,
            "TipoEntrega": `${datos.tipo_entrega}`,
            "TipoServicio": "",
            "TipoCobro": ""
        },
        "Origen": {
            "Domicilio": {
                "CodigoPostal": `${datos.origin}`
            }
        },
        "Destino": {
            "Domicilio": {
                "CodigoPostal": `${datos.destination}`
            }
        },
        "Detalle": [{
            "Dimensiones": {
                "Largo": parseInt(`${datos.largo}`),
                "Alto": parseInt(`${datos.alto}`),
                "Ancho": parseInt(`${datos.ancho}`),
                "Peso": ((parseInt(`${datos.largo}`)*parseInt(`${datos.alto}`)*parseInt(`${datos.ancho}`)/5000))
            }
        }]
    });

    let config = {
        method: 'post',
        url: 'http://qaptpak.grupoampm.com/ws/api/Cotizador/CotizaCliente',
        headers: { 
            'Authorization': 'Basic R0VORVJBTDpHM05FUjRsMDYxMTE4JQ==', 
            'Content-Type': 'application/json'
        },
        data : data
    };

    return axios(config).then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
    });
}


module.exports = {
    Cotizar
};