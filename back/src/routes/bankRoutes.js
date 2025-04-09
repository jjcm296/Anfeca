const express = require('express');
const router = express.Router();
const { getAllBanks, createBank, getBank, deleteBank } = require('../controllers/bankController.js');
const { getAllQuestions, createQuestion, getQuestion,  deleteQuestion} = require('../controllers/questionController.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');
const { checkOwnership } = require('../middlewares/ownershipMiddleware.js');
const { checkBankOwnership } = require('../middlewares/bankOwnershipMiddleware.js');
const Bank = require('../models/Bank.js');

// authenticated for all
router.use(authMiddleware);

router.get('/', getAllBanks);
router.post('/', createBank);
router.get('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), getBank);
router.delete('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), deleteBank);

router.get('/:bankId/questions/', checkBankOwnership, getAllQuestions);
router.post('/:bankId/questions/', checkBankOwnership, createQuestion);
router.get('/:bankId/questions/:questionId', checkBankOwnership, getQuestion);
router.delete('/:bankId/questions/:questionId', checkBankOwnership, deleteQuestion);



module.exports = router;