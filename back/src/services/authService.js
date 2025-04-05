const Account = require('../models/Account.js');
const Guardian = require('../models/Guardian.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VerificationCode = require('../models/VerificationCode.js');
const { sendVerficationCode, verificationCode } = require('../lib/verificationCodeSender.js')
const crypto = require('node:crypto');


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

// ⬇ Send + save code in DB
exports.sendVerificationCodeToGuardian = async (email) => {
    const code = crypto.randomInt(100000, 999999).toString();

    await VerificationCode.findOneAndDelete({ email }); // remove old one if exists

    await VerificationCode.create({ email, code });

    await sendVerficationCode(email, code);
    return code;
};

// ⬇ Check code and create Guardian + Account
exports.validateAndCreateAccount = async ({ name, lastName, email, password, code }) => {
    const stored = await VerificationCode.findOne({ email });

    if (!stored || stored.code !== code) {
        throw new Error('Invalid code or expired');
    }

    const guardian = await Guardian.create({ name, lastName });
    const account = await Account.create({ email, password, guardianId: guardian._id });

    await VerificationCode.deleteOne({ email });

    return { guardian, account };
};