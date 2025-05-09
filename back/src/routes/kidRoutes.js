const express = require('express');
const router = express.Router();
const { createKid, getStreak, getCoins } = require('../controllers/kidController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', createKid);
router.get('/streak', getStreak);
router.get('/coins', getCoins);

module.exports = router;