const GameSession = require('../models/GameSession.js');
const Question = require('../models/Question.js');
const StudySession = require('../models/StudySession.js');

async function unlockGameSessionIfStudyCompleted(bankId, kidId) {
    const studySession = await StudySession.findOne({ bankId, kidId });

    if (studySession) return;

    const gameSession = await GameSession.findOne({ bankId, kidId });
    if (!gameSession) throw new Error("Game session not found");

    if (gameSession.status === null) {
        gameSession.status = true;
        await gameSession.save();
    }
}

exports.createGameSession = async (bankId, kidId, questions) => {

    const existing = await GameSession.findOne({ bankId, kidId });
    if (existing) throw new Error("One game session for this bank already exists");

    await GameSession.create({ bankId, kidId, questions });

    const session = await GameSession.findOne({ bankId, kidId });

    return session;
}

exports.getGameQuestions = async (bankId, kidId) => {
    await unlockGameSessionIfStudyCompleted(bankId, kidId);

    const session = await GameSession.findOne( { bankId, kidId });

    if (!session) throw new Error("Game session not found");

    if (session.status !== true) throw new Error("Game session is locked. Complete the study session first.");


    // Extract array of questionIds
    const questionIds = session.questions.map(q => q.questionId);

    // Retrieve question documents
    const questions = await Question.find({ _id: { $in: questionIds } }).select('-bankId');

    return {
        sessionId: session._id,
        questions
    };

}

exports.processResult = async (sessionId, questions, individualCoins) => {
    await updateGameSession(sessionId, questions, individualCoins)

    const session = await GameSession.findById(sessionId);

    // logic to add the kids coins

    // game session completed so it's time to delete it
    if (!session.status) await GameSession.findByIdAndDelete(sessionId);

    // return the total of coins earned and success message
}

async function updateGameSession (sessionId, questions, individualCoins) {
    const session = await GameSession.findById(sessionId);

    if (!session) throw new Error("Game session not found");

    // if game session is active, then make it inactive
    if (session.status) session.status = false;

    questions.forEach(clientQuestion => {
        const entry = session.questions.find(q => q.questionId.toString() === clientQuestion.questionId);

        if (!entry) {
            throw new Error(`Question ID ${clientQuestion.questionId} not found in session`);
        }

        if (typeof clientQuestion.answeredCorrectly !== 'boolean') {
            throw new Error(`Invalid answeredCorrectly for question ${clientQuestion.questionId}`);
        }

        entry.answeredCorrectly = clientQuestion.answeredCorrectly;
    });

    session.individualCoins = individualCoins;

    await session.save();

}