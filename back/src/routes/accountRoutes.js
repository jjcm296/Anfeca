const express = require('express');
const router = express.Router();
const { switchProfile, getCurrentProfile, getProfilesNames, deleteAccount } = require('../controllers/accountController.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');
const { allowOnly } = require('../middlewares/profileMiddleware.js');

router.use(authMiddleware);

router.post('/profiles/switch', switchProfile);
router.get('/profiles/', getCurrentProfile);
router.get('/profiles/names', getProfilesNames);
router.delete('/', allowOnly(['guardian']), deleteAccount);

module.exports = router;