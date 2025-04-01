// nodemailer
/*const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "stephany.kulas49@ethereal.email",
        pass: "wJuE54yHk4BBwAAWrN",
    },
});

async function main() {
    const info = await transporter.sendMail({
        from: '"Stephany Kulas" <stephany.kulas49@ethereal.email>',
        to: "bar@example.com, baz@example.com",
        subject: "Hola cara de cola",
        text: "hola a todos los mayates",
        html: "<b>Mayate</b>"
    });

    console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);

 */

// brevo
const brevo = require('@getbrevo/brevo');
const crypto = require('node:crypto');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();

let randomCode = crypto.randomInt(100000,999999);

sendSmtpEmail.subject = "Código de verificación";
sendSmtpEmail.htmlContent = `<html><body><p>Su código de verificación es:</p><h1>${randomCode}</h1></body></html>`;
sendSmtpEmail.sender = {"email": "anfecaconcentratda@gmail.com"  };
sendSmtpEmail.to = [{"email": "zuzzet.hs14@gmail.com"}];

apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function (error) {
    console.error(error);
});