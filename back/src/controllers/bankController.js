const bankService = require('../services/bankService.js');

exports.getAllBanks = async (req, res) => {
    try {
        const guardianId = req.user.guardianId;
        console.log(`controller ${guardianId}`)

        const questionsArray = await bankService.getAllBanks(guardianId);
        console.log(`controller ${questionsArray}`)
        res.status(200).json({ message: "Banks fetched successfully", questionsArray });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.createBank = async (req, res) => {
    try {
        const guardianId = req.user.guardianId; // extracted from the token
        const { name } = req.body;

        const bank = await bankService.createBank({ name, guardianId });
        res.status(201).json({ message: "Bank created successfully", bank });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

exports.getBank = async (req, res) => {
    try {
        const {bankId} = req.params;

        const bank = await bankService.getBank(bankId);

        if (!bank) {
            return res.status(404).json({ error: 'Bank not found' })
        }

        res.status(200).json({ message: 'Bank fetched successfully', questionsBank: bank });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteBank = async (req, res) => {
    try {
        const { bankId } = req.params

        await bankService.deleteBank(bankId);

        res.status(200).json({ message: 'Bank deleted successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}