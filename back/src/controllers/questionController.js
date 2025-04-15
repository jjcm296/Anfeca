const questionService = require('../services/questionService.js');
const { createQuestionSchema } = require('../lib/joischemas/bankJoi.js');

exports.getAllQuestions = async (req, res) => {
    try {
        const bankId = req.params.bankId;

        const questionsArray = await questionService.getAllQuestions(bankId);
        res.status(200).json({ message: 'Questions fetched successfully', questions: questionsArray });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.createQuestion = async (req, res) => {
    try {
        const { textQuestion, answers, priority } = req.body;

        await createQuestionSchema.validateAsync({ textQuestion, answers, priority });

        const { bankId } = req.params;

        const question = await questionService.createQuestion({ textQuestion, answers, priority, bankId });
        res.status(201).json({ message: "Question created successfully", question })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getQuestion = async (req, res) => {
    try {

        const { questionId } = req.params;

        const question = await questionService.getQuestion(questionId);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json({ message: 'Question fetched successfully', question });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

exports.deleteQuestion = async (req, res) => {
    try {

        const { questionId } = req.params;

        await questionService.deleteQuestion(questionId);

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}