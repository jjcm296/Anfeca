const nodemailer = require("nodemailer");

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