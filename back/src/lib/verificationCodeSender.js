const crypto = require('node:crypto');

const { apiInstance, sendSmtpEmail } = require('./brevoClient');

const sendVerficationCode = async (email, randomCode) => {


    sendSmtpEmail.subject = "Código de verifcación ConcentraTDA";
    sendSmtpEmail.htmlContent = `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #2c2c2c; padding: 30px; border-radius: 8px; color: white;">
                <h1 style="margin-top: 0;">Inicia sesión en Canva</h1>
                <p>¡Gracias por registrarte en ConcentraTDA! Para poder finalizar con la creación de tu cuenta escribe este código en la app:</p>

                <h2 style="text-align: center; font-size: 32px; background-color: #fff; color: #2c2c2c; padding: 10px; border-radius: 6px; margin: 20px 0;">
                ${randomCode}
                </h2>

                <hr style="border: none; border-top: 1px solid #555; margin: 30px 0;">

                <p style="font-size: 12px; color: #ccc;">
                    Has recibido este correo porque tienes una cuenta de Canva. Este mensaje no tiene fines promocionales ni de marketing y por ese motivo no contiene un enlace para darte de baja. Recibirás este correo incluso si se te ha dado de baja de la lista de distribución de correos de marketing de Canva.
                </p>
            </div>
        </body>
    </html>
    `;

    sendSmtpEmail.sender = {"email": "anfecaconcentratda@gmail.com"  };
    sendSmtpEmail.to = [{email}];

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
        console.error(error);
    });

}

function verificationCode () {
    return crypto.randomInt(100000,999999);
}

module.exports = {
    sendVerficationCode, verificationCode
}