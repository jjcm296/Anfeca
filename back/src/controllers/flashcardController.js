const flashcardService = require('../services/flashcardService.js');

exports.startStudySession = async (req, res) => {
    try {
        const { bankId } = req.params;
        const kidId = req.user.kidId;

        const { sessionId, firstFlashcard } = await flashcardService.initializeStudySession(bankId, kidId);

        res.status(201).json({ sessionId, firstFlashcard });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.study = async (req, res) => {
    try {

        const { studySessionId, flashcardId } = req.params;
        const { feedback } = req.body;

        const result = await flashcardService.study(flashcardId, feedback, studySessionId);

        // if session is complete
        if (result.message === "Study session complete!") {
            return res.status(200).json({ message: result.message });
        }

        // return next flashcard
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
