const express = require('express');
const router = express.Router();
const { login, register, sendCode, verifyCode, refresh } = require('../controllers/authController.js');

router.post('/login', login);
router.post('/register', register);
router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);
router.post('/refresh-token', refresh);

module.exports = router;