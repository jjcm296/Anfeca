const Question = require('../models/Question.js');

exports.createQuestion = async ({ textQuestion, answers, priority, bankId }) => {

    const question = await Question.create({
        textQuestion,
        answers,
        priority,
        bankId
    });

    return { question };

}