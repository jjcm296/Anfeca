const Account = require('../models/Account.js');
const Guardian = require('../models/Guardian.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerficationCode, verificationCode } = require('../lib/verificationCodeSender.js')

exports.registerAccount = async (data) => {
    const { name, lastName, email, password } = data;

    // create data guardian
    const guardian = await Guardian.create({ name, lastName });

    // create data account linked to the guardian
    const account = await Account.create({ email, password, guardianId: guardian._id });

    return  { guardian, account };
}

// return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.login =  async ({ email, password }) => {
    // search account by the email
    const account = await Account.findOne({ email })
        .select('+password')
        .populate('guardianId');
    if (!account) throw new Error('Email or password incorrect');

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) throw new Error('Incorrect password');

    // generate token JWT
    const payload = { id: account._id, guardianId: account.guardianId._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return token;
}


exports.sendVerificationCodeToGuardian = async (email) => {
    let code= verificationCode();

    sendVerficationCode(email,code);
    return code;
}

exports.verifyEmailCode = async (email, codeSended, codeGiven) => {
    return codeSended === codeGiven && email;
}


