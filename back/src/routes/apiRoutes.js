const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes.js'));
router.use('/kids', require('./kidRoutes.js'));
router.use('/questions-bank', require('./questionsBankRoutes.js'));
router.use('/rewards', require('./rewardRoutes.js'));

module.exports = router;