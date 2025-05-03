const Question = require('../models/Question.js');

exports.getAllQuestions = async (bankId) => {
    return Question.find({bankId});
};

exports.createQuestion = async ({ textQuestion, answers, priority, bankId }) => {

    const duplicatedQuestion = await Question.find({ textQuestion, answers, priority, bankId });

    if (duplicatedQuestion > 0) throw new Error("The same exact question already exists");

    await Question.create({ textQuestion, answers, priority, bankId });

    const question = await Question.findOne({ textQuestion, answers, priority, bankId }).lean();

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

    if (!updatedQuestion) throw new Error("Updated question not found")

    return updatedQuestion;

};

exports.deleteQuestion = async (questionId) => {

    await Question.findByIdAndDelete(questionId);

};

exports.deleteQuestionsByBankId = async (bankId) => {
    const deletedDocs = await Question.deleteMany({ bankId });

    return `Number of questions deleted ${deletedDocs}`;
};