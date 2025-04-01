const Account = require('../models/Account.js');
const Guardian = require('../models/Guardian.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

exports.sendVerificationCode = async (email) => {

}

exports.verifyEmailCode = async (email,code) => {

}


