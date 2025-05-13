const kidService = require('../services/kidService.js');

exports.createKid = async (req, res) => {
    try {
        const guardianId = req.user.guardianId; // extracted from the token
        const { name } = req.body;

        const kid  = await kidService.createKidProfile({ name, guardianId });
        res.status(201).json({ message: "Kid created successfully", kid })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getStreak = async (req, res) => {
    try {
        let kidId = req.user.kidId;

        if (!kidId) {
            const kid = await kidService.getKidByGuardianId(req.user.guardianId);
            kidId = kid._id;
        }

        const streak = await kidService.getStreak(kidId);

        res.status(200).json({ streak });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getCoins = async (req, res) => {
    try {
        let kidId = req.user.kidId;

        if (!kidId) {
            const kid = await kidService.getKidByGuardianId(req.user.guardianId);
            kidId = kid._id;
        }

        const coins = await kidService.getCoins(kidId);

        res.status(200).json({ coins });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}