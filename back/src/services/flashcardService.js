const Flashcard = require('../models/Flashcard.js');
const studySessionService = require('../services/studySessionService.js');
const gameSessionService = require('../services/gameSessionService.js');
const { studySessionSchema } = require('../lib/joischemas/studySessionJoi.js');
const { newGameSchema } = require('../lib/joischemas/gameSessionJoi.js');
const retrievalService = require('../services/retrievalService.js');
const mongoose = require('mongoose');

getFlashcard = async (flashcardId, bankId) => {
    const flashcard = await Flashcard.findOne({ _id: flashcardId, bankId });

    if (!flashcard) throw new Error("Flashcard not found");

    return flashcard;
}

exports.getFlashcardsForStudy = async (bankId) => {
    const count = 5;
    return Flashcard.aggregate([
        {
            $match: {
                bankId: new mongoose.Types.ObjectId(bankId)
            }
        },
        {
            $sample: {size: count}
        }
    ]);
};

exports.getFlashcardById = async (flashcardId) => {
    const flashcard = await Flashcard.findById(flashcardId);

    if (!flashcard) throw new Error("Flashcard not found");

    return flashcard;
}


exports.createFlashcard = async (front, back, questionId, bankId ) => {
    const duplicatedFlashcard = await Flashcard.find({ questionId, bankId });

    if (duplicatedFlashcard.length > 0) throw new Error("Flashcard already exists");

    const clearBack = back.join('\n');

    await Flashcard.create({ front, back: clearBack, questionId, bankId });

    const flashcard = await Flashcard.findOne({ questionId, bankId });

    return flashcard;

}

exports.updateFlashcard = async (flashcardId, updatedFields) => {

    const flashcard = await Flashcard.findByIdAndUpdate(flashcardId, updatedFields);
    if (!flashcard) throw new Error("Flashcard not found");

    const updatedFlashcard = await Flashcard.findById(flashcardId);

    if(!updatedFlashcard) throw new Error("Flashcard not found or updated");

    return updatedFlashcard;

}

exports.initializeStudySession = async (bankId, kidId) => {
    const { flashcardIds, questionIds } = await retrievalService.retrieve(bankId);

    if (!Array.isArray(flashcardIds) || flashcardIds.length === 0) {
        throw new Error("No flashcards found for this kid and bank");
    }

    // creating the array of subdocument {flashcardId, status}
    const cards = flashcardIds.map(id => ({
        flashcardId: id,
        status: 1
    }));

    // creating the array of subdocument { questionId, answeredCorrectly}
    const questions = questionIds.map(id => ({
        questionId: id,
        answeredCorrectly: null
    }));

    // validate for correct insertion
    const { error: studyError } = studySessionSchema.validate({ bankId, kidId, cards });
    if (studyError) throw new Error(studyError.details[0].message);

    const { error: gameError } = newGameSchema.validate({ bankId, kidId, questions });
    if (gameError) throw new Error(gameError.details[0].message);


    // create a study session and a game session
    await studySessionService.createStudySession(bankId, kidId, cards);
    await gameSessionService.createGameSession(bankId, kidId, questions);

    const session = await studySessionService.getStudySession(bankId, kidId);

    const firstCardId = cards[0].flashcardId;
    const firstFlashcard =  await Flashcard.findById(firstCardId).select('front back');

    return  { session, firstFlashcard } ;

};


exports.study = async (flashcardId, feedback, studySessionId) => {
    const session = await studySessionService.getSessionById(studySessionId);

    // feedback = 1 muy difícil
    // feedback = 2 difícil
    // feedback = 3 fácil
    // feedback = 4  muy fácil

    if (feedback === undefined || feedback === null) throw new Error("No feedback provided");
    if (feedback > 4 || feedback < 1) throw new Error("Invalid feedback, must be from 1 to 4");

    const flashcard = await studySessionService.getFlashcardFromSession(flashcardId);
    if (!flashcard) throw new Error("Flashcard not found");

    const index = session.cards.findIndex(item => item.flashcardId.toString() === flashcardId.toString());
    if (index === -1) {
        throw new Error("Flashcard not found in the current study session");
    }

    if (feedback === 4) {
        session.cards.splice(index, 1);
    } else {
        const current = session.cards.splice(index, 1)[0];
        session.cards.push(current);
    }

    if (session.cards.length === 0) {
        await session.deleteOne();
        // ADD A COIN TO THE KID
        return { message: "Study session complete!" };
    }

    await session.save();

    const nextFlashcardId = session.cards[0].flashcardId;
    const nextFlashcard = await Flashcard.findById(nextFlashcardId).select('front back');

    return nextFlashcard;


}

