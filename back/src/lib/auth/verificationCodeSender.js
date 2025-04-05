const { apiInstance, createEmailInstance  } = require('./brevoClient');

const sendVerficationCode = async (email, randomCode) => {

    const sendSmtpEmail = createEmailInstance();

    sendSmtpEmail.subject = "Código de verifcación ConcentraTDA";
    sendSmtpEmail.htmlContent = `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffff; padding: 30px; border-radius: 8px; color: black;">
                <h1 style="margin-top: 0;">Crea tu cuenta en ConcentraTDA </h1>
                <p>¡Gracias por registrarte en ConcentraTDA! Para poder finalizar con la creación de tu cuenta escribe este código en la app:</p>

                <h2 style="text-align: center; font-size: 32px; background-color: #fff; color: #2c2c2c; padding: 10px; border-radius: 6px; margin: 20px 0;">
                ${randomCode}
                </h2>

                <hr style="border: none; border-top: 1px solid #555; margin: 30px 0;">
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

module.exports = {
    sendVerficationCode
}