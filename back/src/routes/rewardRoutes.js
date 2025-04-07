const express = require('express');
const { createReward, deleteReward } = require('../controllers/rewardController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createReward);
router.delete('/:rewardId', authMiddleware, deleteReward);

module.exports = router;

