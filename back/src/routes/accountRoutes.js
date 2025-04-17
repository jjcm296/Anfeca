const express = require('express');
const router = express.Router();
const { switchProfile, getCurrentProfile, getProfilesNames } = require('../controllers/accountController.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');

router.use(authMiddleware);

router.post('/profiles/switch', switchProfile);
router.get('/profiles/', getCurrentProfile);
router.get('/profiles/names', getProfilesNames);

module.exports = router;