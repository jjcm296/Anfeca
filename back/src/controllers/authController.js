const Account = require('../models/Account.js');
const authService = require('../services/authService.js');

exports.register = async (req, res) => {
    try {
        const { guardian, account } = await authService.registerAccount(req.body);
        res.status(201).json({ message: "Guardian registered succesfully", guardian, account });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { token, guardian } = await authService.login(req.body);
        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// verify if that email already exists in the database

exports.sendCode = async (req,res) => {
    try {
        await authService.sendVerificationCodeToGuardian();
        res.status(200).json({
           message: 'code succesfully sent'
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

exports.validateEmail = async (req,res) => {
    try {

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}