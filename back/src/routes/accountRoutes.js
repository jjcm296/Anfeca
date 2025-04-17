const express = require('express');
const router = express.Router();
const { switchProfile, getCurrentProfile } = require('../controllers/accountController.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');

router.use(authMiddleware);

router.post('/profile/switch', switchProfile);
router.get('/profile/', getCurrentProfile);

module.exports = router;