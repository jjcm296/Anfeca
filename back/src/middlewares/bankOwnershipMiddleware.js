const Bank = require('../models/Bank.js');

// Check that the guardian owns the specified bank (for routes with :bankId)
exports.checkBankOwnership = async (req, res, next) => {
    try {
        const bankId = req.params.bankId;
        const guardianId = req.user.guardianId;

        const bank = await Bank.findById(bankId);
        if (!bank) return res.status(404).json({ error: 'Questions Bank not found' });

        if (!bank.guardianId.equals(guardianId)) {
            return res.status(403).json({ error: 'You are not authorized to access this Questions Bank' });
        }

        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};