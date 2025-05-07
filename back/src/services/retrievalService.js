// service  that is responsible for selecting the questions and flashcards for each bank
const flashcardService = require('./flashcardService.js');
const Flashcard = require('../models/Flashcard.js');
const Question = require('../models/Question.js');

// function that returns an array of the flashcard for the study session or questions for the game session
// function that cooks (?) the set of questions and flashcard for the session
exports.retrieve = async (bankId) => {
    const flashcards = await flashcardService.getFlashcardsForStudy(bankId);

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error("No flashcards found for this kid and bank");
    }

    const flashcardIds = flashcards.map(f => f._id);
    const questionIds = flashcards.map(f => f.questionId);

    return { flashcardIds, questionIds };
}