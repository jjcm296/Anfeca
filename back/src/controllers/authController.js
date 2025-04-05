const Account = require('../models/Account.js');
const authService = require('../services/authService.js');

exports.register = async (req, res) => {
    try {
        const { guardian, account } = await authService.registerAccount(req.body);
        res.status(201).json({ message: "Guardian registered succesfully", guardian, account });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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

exports.sendCode = async (req, res) => {
    try {
        const { email } = req.body;
        await authService.sendVerificationCodeToGuardian(email);
        res.status(200).json({ message: 'Code successfully sent' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.validateEmail = async (req, res) => {
    try {
        const result = await authService.validateAndCreateAccount(req.body);
        res.status(201).json({ message: 'Cuenta creada exitosamente', ...result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
