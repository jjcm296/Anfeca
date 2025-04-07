const Question = require('../models/Question.js');

exports.getAllQuestions = async (bankId) => {
    return Question.find({bankId});
};

exports.createQuestion = async ({ textQuestion, answers, priority, bankId }) => {

    const question = await Question.create({
        textQuestion,
        answers,
        priority,
        bankId
    });

    return question ;

}

exports.getQuestion = async (questionId) => {

    const question = Question.findById(questionId);

    return question;

}

exports.deleteQuestion = async (questionId) => {

    await Question.findByIdAndDelete(questionId);
}