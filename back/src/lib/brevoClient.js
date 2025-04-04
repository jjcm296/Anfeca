const brevo = require('@getbrevo/brevo');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

module.exports = {
  apiInstance: new brevo.TransactionalEmailsApi(),
  sendSmtpEmail: new brevo.SendSmtpEmail()
};