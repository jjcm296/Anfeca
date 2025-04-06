const Account = require('../models/Account.js');
const Guardian = require('../models/Guardian.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Session = require('../models/Session.js');
const jwtUtils = require('../lib/auth/jwtUtils.js');
const VerificationCode = require('../models/VerificationCode.js');
const { sendVerficationCode } = require('../lib/auth/verificationCodeSender.js')
const crypto = require('node:crypto');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });



exports.registerAccount = async (data) => {

    // destructured fields
    const { name, lastName, email, password } = data;

    const existingEmail = await Account.findOne({ email });

    if (existingEmail) {
        throw new Error("Email already in use");
    }

    // querying if the code is verfied
    const emailWithValidatedCode = await VerificationCode.findOne({
        email,
        isVerified: true
    });

    // if it's not verified, then throw an error, if it is, then delete the document
    if (!emailWithValidatedCode) {
        throw new Error("Email not verified with a valid code");
    } else {
        await VerificationCode.deleteOne({ email });
    }

    // create data guardian
    const guardian = await Guardian.create({ name, lastName });

    // create data account linked to the guardian
    const account = await Account.create({ email, password, guardianId: guardian._id });

    return  { guardian, account }; // returns mongoose documents
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

    const payload = { id: account._id, guardianId: account.guardianId._id };

    const accessToken = jwtUtils.generateAccesToken(payload);
    const refreshToken = jwtUtils.generateRefreshToken(payload);

    await Session.create({
       accountId: account._id,
        refreshToken,
        expiresAt: new Date(
            Date.now() + jwtUtils.parseExpiration(process.env.JWT_REFRESH_EXPIRES_IN)
        )
    });

    return { accessToken, refreshToken };

}

// Send + save code in DB
exports.sendVerificationCodeToGuardian = async (email) => {
    const code = crypto.randomInt(100000, 999999).toString();

    await VerificationCode.findOneAndDelete({ email }); // remove old one if exists

    await VerificationCode.create({ email, code });

    await sendVerficationCode(email, code);
    return code;
};

// Check code and create Guardian + Account
exports.validateVerificationCode = async ({ email, code }) => {
    const stored = await VerificationCode.findOne({ email });

    if (!stored || stored.code !== code) {
        throw new Error('Invalid code or expired');
    } else {
        await VerificationCode.updateOne({ email }, { isVerified: true });
    }

    return true;
};