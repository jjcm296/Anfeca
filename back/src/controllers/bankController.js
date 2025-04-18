const bankService = require('../services/bankService.js');
const {createBankSchema} = require('../lib/joischemas/bankJoi.js')

exports.getAllBanks = async (req, res) => {
    try {

        const guardianId = req.user.guardianId;

        const banksArray = await bankService.getAllBanks(guardianId);

        res.status(200).json({ message: "Banks fetched successfully", banksArray });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createBank = async (req, res) => {
    try {
        await createBankSchema.validateAsync(req.body);

        const guardianId = req.user.guardianId; // extracted from the token
        const { name } = req.body;

        const bank = await bankService.createBank({ name, guardianId });
        res.status(201).json({ message: "Bank created successfully", bank });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

exports.getBank = async (req, res) => {
    try {
        const {bankId} = req.params;

        const bank = await bankService.getBank(bankId);

        if (!bank) {
            return res.status(404).json({ error: 'Bank not found' })
        }

        res.status(200).json({ message: 'Bank fetched successfully', bank });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.editBank = async (req, res) => {

    try {

        const { bankId } = req.params;

        await createBankSchema.validateAsync(req.body);

        const updatedBank = await bankService.editBank(bankId, req.body);

        return res.status(200).json({ message: "Bank successfully updated", updatedBank });

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

};


exports.deleteBank = async (req, res) => {
    try {
        const { bankId } = req.params

        await bankService.deleteBank(bankId);

        res.status(200).json({ message: 'Bank deleted successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};