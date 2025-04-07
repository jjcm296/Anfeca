const rewardService = require('../services/rewardService.js');

exports.createReward = async (req, res) => {

    try {
        const { name, price, type, redemptionLimit } = req.body;
        const guardianId  = req.user.guardianId; // extracted from the token

        const reward = await rewardService.createReward({
            name,
            price,
            type,
            redemptionLimit,
            guardianId
        });

        res.status(201).json({ message: "Reward created successfully",  reward});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

exports.getReward = async (req, res) => {
    try {

        const { rewardId } = req.params;

        const reward = await rewardService.getReward(rewardId);

        if (!reward) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        res.status(200).json({ message: 'Reward fetched successfully', reward });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteReward = async (req, res) => {
    try {
        const { rewardId } = req.params

        await rewardService.deleteReward(rewardId);

        res.status(200).json({ message: 'Reward deleted successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}