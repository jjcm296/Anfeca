const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes.js'));
router.use('/kids', require('./kidRoutes.js'));
router.use('/banks', require('./bankRoutes.js'));
router.use('/rewards', require('./rewardRoutes.js'));
router.use('/account', require('./accountRoutes.js'));
router.use('/game', require('./gameRoutes.js'));

module.exports = router;