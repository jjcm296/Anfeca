const QuestionsBank = require('../models/QuestionsBank.js');

exports.createQuestionsBank = async ({ name, guardianId  }) => {

    const questionsBank = await QuestionsBank.create({ name, guardianId })

    return { questionsBank };
}