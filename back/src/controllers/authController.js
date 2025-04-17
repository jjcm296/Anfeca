const authService = require('../services/authService.js');
const jwtUtils = require('../lib/auth/jwtUtils.js');
const {generateKidPayload,generateGuardianPayload} = require('../lib/auth/payload');
const Session = require('../models/Session.js');
const { registerSchema,
    loginSchema,
    verificationCodeSchema,
    verifyEmail,
    verifyPassword
}
    = require('../lib/joischemas/authJoi.js');

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

exports.register = async (req, res) => {
    try {
        await registerSchema.validateAsync(req.body)
        // checks

        const { guardian, account } = await authService.registerAccount(req.body);
        // mongoose objects are now json
        res.status(201).json({ message: "Guardian registered succesfully", guardian, account });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {

        await loginSchema.validateAsync(req.body)

        const { accessToken, refreshToken } = await authService.login(req.body);
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};


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

        await verificationCodeSchema.validateAsync(req.body)

        await authService.validateVerificationCode(req.body);
        return  res.status(201).json({ message: 'Verification code is valid' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
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
            accountId: decoded.id, refreshToken
        });

        if (!session) throw new Error("Couldn't find any session");

        let payload;

        if (decoded.profileType === 'guardian') {
            payload = generateGuardianPayload(decoded.id, decoded.guardianId, "guardian");

        } else if (decoded.profileType === 'kid') {
            payload = generateKidPayload(decoded.id, decoded.guardianId,decoded.kidId, "kid");

        } else {
            return res.status(400).json({ error: 'Invalid profile type in refresh token' });
        }

        const newAccessToken = jwtUtils.generateAccesToken(payload);

        return res.status(200).json({ accessToken: newAccessToken });

    } catch {
        return res.status(403).json({ error: 'Invalid refresh token' });

    }
}

exports.verifyEmail = async (req, res) => {
    try {

        await verifyEmail.validateAsync(req.body);

        return res.status(200).json({ message: 'Email is valid' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.verifyPassword = async (req, res) => {
    try {

        await verifyPassword.validateAsync(req.body);

        return res.status(200).json({ message: 'Valid password' });
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
