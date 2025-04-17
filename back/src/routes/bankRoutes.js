const express = require('express');
const router = express.Router();
const { getAllBanks, createBank, getBank, deleteBank } = require('../controllers/bankController.js');
const { getAllQuestions, createQuestion, getQuestion,  deleteQuestion} = require('../controllers/questionController.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');
const { checkOwnership } = require('../middlewares/ownershipMiddleware.js');
const { checkBankOwnership } = require('../middlewares/bankOwnershipMiddleware.js');
const { allowOnly } = require('../middlewares/profileMiddleware.js');
const Bank = require('../models/Bank.js');

// authenticated for all
router.use(authMiddleware);

router.get('/', getAllBanks);
router.post('/', allowOnly(['guardian']) ,createBank);
router.get('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), getBank);
router.delete('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), allowOnly(['guardian']) , deleteBank);

router.get('/:bankId/questions/', checkBankOwnership, getAllQuestions);
router.post('/:bankId/questions/', checkBankOwnership, allowOnly(['guardian']) , createQuestion);
router.get('/:bankId/questions/:questionId', checkBankOwnership, allowOnly(['guardian']) , getQuestion);
router.delete('/:bankId/questions/:questionId', checkBankOwnership, allowOnly(['guardian']) , deleteQuestion);



module.exports = router;