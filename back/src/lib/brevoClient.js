const SibApiV3Sdk  = require('sib-api-v3-sdk');
const path = require('path');


require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let defaultClient = SibApiV3Sdk .ApiClient.instance;

//console.log(SibApiV3Sdk );

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

module.exports = {
  apiInstance: new SibApiV3Sdk .TransactionalEmailsApi(),
  createEmailInstance: () => new SibApiV3Sdk .SendSmtpEmail()
};