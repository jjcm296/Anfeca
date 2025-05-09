const gameSessionService = require('../services/gameSessionService.js');

exports.getGameQuestions = async (req, res) => {
    try {
        const { bankId } = req.params;
        const kidId = req.user.kidId;

        const { sessionId, questions } = await gameSessionService.getGameQuestions(bankId, kidId);

        res.status(201).json({ sessionId, questions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.processGameResult = async (req,res) => {
    try {
        const { gameSessionId } = req.params;
        const { questions, individualCoins } = req.body;

        const earnedCoins = await gameSessionService.processResult(gameSessionId, questions, individualCoins);

        res.status(200).json({ message: 'Game successfully completed', earnedCoins });
    } catch (error) {
        res.status(400).json({ error: error.message });

    }
}