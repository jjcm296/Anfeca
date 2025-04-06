const express = require('express');
const router = express.Router();
const { createQuestionsBank } = require('../controllers/questionsBankController.js');
const { createQuestion } = require('../controllers/questionController.js')
const { authMiddleware } = require('../middlewares/authMiddleware.js');

router.post('/', authMiddleware, createQuestionsBank);

router.post('/:bankId/question', authMiddleware, createQuestion);

module.exports = router;