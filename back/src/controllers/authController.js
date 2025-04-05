const Account = require('../models/Account.js');
const authService = require('../services/authService.js');
const jwtUtils = require('../lib/auth/jwtUtils.js');
const Session = require('../models/Session.js');

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

exports.verifyCode = async (req, res) => {
    try {
        await authService.validateVerificationCode(req.body);
        res.status(201).json({ message: 'Verification code is valid' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken) {
        return res.status(400).json({ error: 'No refresh token provided' });
    }

    try {
        const decoded = jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
        const session = await Session.findOne({
            guardianId: decoded.guardianId, refreshToken
        });
        if (!session) throw new Error();

        const newAccessToken = jwtUtils.generateAccesToken({
            guardianId: decoded.guardianId
        });

        return res.status(200).json({ accessToken: newAccessToken });

    } catch {
        return res.status(403).json({ error: 'Invalid refresh token' });

    }
}
