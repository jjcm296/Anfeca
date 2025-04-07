const express = require('express');
const { getAllRewards, createReward, getReward, deleteReward } = require('../controllers/rewardController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();
const { checkOwnership } = require('../middlewares/ownershipMiddleware.js');
const Reward = require('../models/Reward.js');

router.use(authMiddleware);
router.param('rewardId', checkOwnership(Reward, 'rewardId', 'Reward'));

router.get('/', getAllRewards);
router.post('/', createReward);
router.get('/:rewardId', getReward);
router.delete('/:rewardId', deleteReward);

module.exports = router;

