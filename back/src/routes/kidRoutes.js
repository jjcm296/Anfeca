const express = require('express');
const router = express.Router();
const { createKid } = require('../controllers/kidController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/create-kid', authMiddleware, createKid);

module.exports = router;