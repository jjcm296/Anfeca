const bankService = require('../services/bankService.js');
const questionService = require('../services/questionService.js');

const idAccount = "682383ab981d13ad269c861f";
const idGuardian = "682383ab981d13ad269c861d"

exports.getPremiumBanks = async (req, res) => {
    try {

        const premiumBanks = await bankService.getAllBanks(idGuardian);

        res.status(200).json({ premiumBanks });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getPremiumBank = async (req, res) => {
    try {
        const {bankId} = req.params;

        const bank = await bankService.getBank(bankId);

        res.status(200).json({ bank });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getQuestions = async (req, res) => {
    try {
        const bankId = req.params.bankId;

        const questions = await questionService.getAllQuestions(bankId);
        res.status(200).json({ questions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}