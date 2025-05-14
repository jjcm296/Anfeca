const express = require('express');
const router = express.Router();
const { getPremiumBanks, getPremiumBank, getQuestions } = require('../controllers/premiumController.js');

router.get('/banks', getPremiumBanks);
router.get('/banks/:bankId', getPremiumBank);
router.get('/banks/:bankId/questions', getQuestions);

module.exports = router;