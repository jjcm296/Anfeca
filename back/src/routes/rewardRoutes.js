const express = require('express');
const { getAllRewards, createReward, getReward, editReward, deleteReward } = require('../controllers/rewardController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();
const { checkOwnership } = require('../middlewares/ownershipMiddleware.js');
const { allowOnly } = require('../middlewares/profileMiddleware.js');
const Reward = require('../models/Reward.js');

router.use(authMiddleware);

router.get('/', getAllRewards);
router.post('/', allowOnly(['guardian']), createReward);
router.get('/:rewardId', checkOwnership(Reward, 'rewardId', 'Reward'), allowOnly(['guardian']), getReward);
router.put('/:rewardId', checkOwnership(Reward, 'rewardId', 'Reward'), allowOnly(['guardian']), editReward);
router.delete('/:rewardId', checkOwnership(Reward, 'rewardId', 'Reward'), allowOnly(['guardian']), deleteReward);

module.exports = router;

