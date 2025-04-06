const express = require('express');
const router = express.Router();
const { login, register, sendCode, verifyCode, refresh } = require('../controllers/authController.js');

router.post('/login', login);
router.post('/register', register);
router.post('/verification-code', sendCode);
router.post('/verification-code/verify', verifyCode);
router.post('/token/refresh', refresh);

module.exports = router;