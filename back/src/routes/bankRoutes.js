const express = require('express');
const router = express.Router();
const { getAllBanks, createBank, getBank, editBank, deleteBank } = require('../controllers/bankController.js');
const { getAllQuestions, createQuestion, editQuestion, getQuestion,  deleteQuestion} = require('../controllers/questionController.js');
const {startStudySession, study} = require('../controllers/flashcardController.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');
const { checkOwnership } = require('../middlewares/ownershipMiddleware.js');
const { checkBankOwnership } = require('../middlewares/bankOwnershipMiddleware.js');
const { allowOnly } = require('../middlewares/profileMiddleware.js');
const Bank = require('../models/Bank.js');

// authenticated for all
router.use(authMiddleware);

// routes available for guardians and kids
router.get('/', getAllBanks);
router.get('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), getBank);


// CRUD banks and questions only for guardian
router.post('/', allowOnly(['guardian']) ,createBank);
router.get('/:bankId/questions/', checkBankOwnership, allowOnly(['guardian']), getAllQuestions);
router.put('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), allowOnly(['guardian']), editBank);
router.delete('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), allowOnly(['guardian']) , deleteBank);

router.post('/:bankId/questions/', checkBankOwnership, allowOnly(['guardian']) , createQuestion);
router.get('/:bankId/questions/:questionId', checkBankOwnership, allowOnly(['guardian']) , getQuestion);
router.put('/:bankId/questions/:questionId', checkBankOwnership, allowOnly(['guardian']) , editQuestion);
router.delete('/:bankId/questions/:questionId', checkBankOwnership, allowOnly(['guardian']) , deleteQuestion);

// flashcards only for kids
router.get('/:bankId/flashcards/study-session', allowOnly(['kid']), startStudySession);
router.post('/:bankId/flashcards/study-session/:studySessionId/:flashcardId', allowOnly(['kid']), study);

module.exports = router;