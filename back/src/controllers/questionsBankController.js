const questionsBankService = require('../services/questionsBankService.js');

exports.createQuestionsBank = async (req, res) => {
    try {
        const guardianId = req.user.guardianId; // extracted from the token
        const { name } = req.body;

        const questionsBank = await questionsBankService.createQuestionsBank({ name, guardianId });
        res.status(201).json({ message: "Questions Bank created successfully" });

    } catch (error) {

    }

}