const StudySession = require('../models/StudySession.js');
const Flashcard = require('../models/Flashcard.js');
const GameSession = require("../models/GameSession");

exports.createStudySession = async ( bankId, kidId, cards ) => {
    let session = await StudySession.findOne({ bankId, kidId });

    if (!session) {
        await StudySession.create({ bankId, kidId, cards});
        session = await StudySession.findOne({ bankId, kidId });
    }

    return session;

}

exports.getStudySession = async (bankId, kidId) => {
    const session = await StudySession.findOne({ bankId, kidId});

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

exports.deleteStudySession = async (bankId) => {

    const session = await GameSession.find({bankId});

    await GameSession.findByIdAndDelete(session._id);

};