const express = require('express');
const router = express.Router();
const { createQuestionsBank } = require('../controllers/questionsBankController.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');

router.post('/create-questions-bank', authMiddleware, createQuestionsBank);

module.exports = router;