const questionService = require('../services/questionService.js');

exports.createQuestion = async (req, res) => {
    try {
        const { textQuestion, answers, priority } = req.body;
        const { bankId } = req.params;

        console.log(req.body);
        console.log(req.params);
        console.log({ textQuestion, answers, priority, bankId });

        const question = await questionService.createQuestion({ textQuestion, answers, priority, bankId });
        res.status(201).json({ message: "Question created successfully", question })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}