const express = require('express');
const { createReward } = require('../controllers/rewardController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createReward);

module.exports = router;

