const express = require('express');
const router = express.Router();
const { getAllBanks, createBank, getBank, deleteBank } = require('../controllers/bankController.js');
const { createQuestion } = require('../controllers/questionController.js')
const { authMiddleware } = require('../middlewares/authMiddleware.js');
const { checkOwnership } = require('../middlewares/ownershipMiddleware.js');
const { checkBankOwnership } = require('../middlewares/bankOwnershipMiddleware.js');
const Bank = require('../models/Bank.js');

// authenticated for all
router.use(authMiddleware);

router.get('/',checkOwnership(Bank, 'bankId', 'Bank'), getAllBanks);
router.post('/',checkOwnership(Bank, 'bankId', 'Bank'), createBank);
router.get('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), getBank);
router.delete('/:bankId', checkOwnership(Bank, 'bankId', 'Bank'), deleteBank);

router.post('/:bankId/questions/', checkBankOwnership, createQuestion);


module.exports = router;