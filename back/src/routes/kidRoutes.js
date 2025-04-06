const express = require('express');
const router = express.Router();
const { createKid } = require('../controllers/kidController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

console.log('createKid:', createKid);

router.post('/createKid', authMiddleware, createKid);

module.exports = router;