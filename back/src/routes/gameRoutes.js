const express = require('express');
const router = express.Router();
const { getGameQuestions, processGameResult } = require('../controllers/gameSessionController.js');
const { allowOnly } = require('../middlewares/profileMiddleware.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');

// protected routes
router.use(authMiddleware);

router.get('/:bankId/start-game', allowOnly(['kid']), getGameQuestions);
router.post('/:bankId/:gameSessionId/result', allowOnly(['kid']), processGameResult);

module.exports = router;