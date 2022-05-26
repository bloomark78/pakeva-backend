const axios = require('axios');

const appidOS = process.env.APP_ID_OS || 'aecca847-c261-4a19-bf82-08306c5d9658';
const keyOS = process.env.API_KEY_OS || 'ZDc2MjM1NmUtMzc1MC00YmY1LTlkYTUtNWFlYjY4MTJhZTMw';

const instance = axios.create({
    baseURL: 'https://onesignal.com/api/v1/notifications',
    timeout: 5000,
    headers: { 'Authorization': 'Basic '+keyOS }
});

const push = async (push) => {
	const message = {
        app_id: appidOS,
        data: push.data,
        contents: { "en": push.body, "es": push.body },
        headings: { "en": push.title, "es": push.title },
        include_player_ids: [push.token]
    };
	await instance.post('',message).then((resp) => {
		console.log("Push enviada");
	})
	.catch((err) => {
		console.log("Error al enviar la push");
	});
};

const pinPush = async (pin, email, token) => {
    const mensaje = "Pin de Verificación: "+pin;
    const message = {
        app_id: appidOS,
        data: { pin: pin, email: email, task: 'Verificacion' },
        contents: { "en": mensaje, "es": mensaje},
        headings: { "en": "Verificación de cuenta", "es": "Verificaión de cuenta" },
        include_player_ids: [token],
    };

    await instance.post('', message).then((resp) => {
        console.log("Push con pin de verficacion enviado correctamente");
    })
    .catch((err) => {
        console.log("Error al enviar push con el pin de verificacion");
    });
};


module.exports = {
    push,
    pinPush
};