const StudySession = require('../models/StudySession.js');
const Flashcard = require('../models/Flashcard.js');

exports.createStudySession = async ( bankId, kidId, cards ) => {
    console.log(cards)
    const existing = await StudySession.findOne({ bankId, kidId });
    if (existing) throw new Error("One session for this bank already exists");

    await StudySession.create({ bankId, kidId, cards})

    const session = await StudySession.findOne({ bankId, kidId });

    return session;

}

exports.getStudySession = async (bankId, kidId) => {
    const session = await StudySession.findOne({ bankId, kidId}).select('_id');

    if (!session) {
        throw new Error("Study session not found for this kid and bank");
    }

    return session;
}

exports.getSessionById = async (studySessionId) => {
    const session = await StudySession.findById(studySessionId);

    if (!session) {
        throw new Error("Study session not found for this kid and bank");
    }

    return session;
}


exports.getFlashcardFromSession = async (flashcardId) => {
    const session = await StudySession.findOne({
        'cards.flashcardId': flashcardId
    });

    if (!session) {
        throw new Error("Flashcard not found in the  study session");
    }

    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
        throw new Error("Flashcard does not exist in database");
    }

    return flashcard;
};