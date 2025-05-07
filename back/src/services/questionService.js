const Question = require('../models/Question.js');
const flashcardService = require('./flashcardService.js');
const Flashcard = require('../models/Flashcard.js');

exports.getAllQuestions = async (bankId) => {
    return Question.find({bankId});
};

exports.createQuestion = async ({ textQuestion, answers, priority, bankId }) => {

    const duplicatedQuestion = await Question.find({ textQuestion, answers, priority, bankId });

    if (duplicatedQuestion.length > 0) throw new Error("The same exact question already exists");

    await Question.create({ textQuestion, answers, priority, bankId });

    const question = await Question.findOne({ textQuestion, answers, priority, bankId }).lean();

    const correctAnswers = answers.filter(a=> a.isCorrect).map(a => a.textAnswer);

    const flashcard = await flashcardService.createFlashcard(textQuestion, correctAnswers, question._id, bankId);

    if (!flashcard) throw new Error("Flashcard wasn't created");

    return question ;

};

exports.getQuestion = async (questionId) => {

    const question = await Question.findById(questionId);

    if (!question) throw new Error("Question not found");

    return question;

};

exports.editQuestion = async (questionId, updatedFields) => {

    const question = await Question.findByIdAndUpdate(questionId, updatedFields);

    if (!question) throw new Error("Question not found");

    const updatedQuestion = await Question.findById(questionId);

    if (!updatedQuestion) throw new Error("Updated question not found");

    const flashcard = await Flashcard.findOne({ questionId });
    if (!flashcard) throw new Error("Flashcard not found for this question");

    const front = updatedFields.textQuestion || question.textQuestion;

    let updatedBack = flashcard.back;
    if (updatedFields.answers) {
        const correctAnswers = updatedFields.answers
            .filter(a => a.isCorrect)
            .map(a => a.textAnswer)
            .join('\n');
        updatedBack = correctAnswers;
    }

    await flashcardService.updateFlashcard(flashcard._id, {
        front,
        back: updatedBack
    });



    return updatedQuestion;

};

exports.deleteQuestion = async (questionId) => {

    await Flashcard.findOneAndDelete({ questionId });

    await Question.findByIdAndDelete(questionId);

};

exports.deleteQuestionsByBankId = async (bankId) => {
    const deletedDocs = await Question.deleteMany({ bankId });

    return `Number of questions deleted ${deletedDocs}`;
};