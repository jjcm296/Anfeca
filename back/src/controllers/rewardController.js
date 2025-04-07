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

exports.deleteReward = async (req, res) => {
    try {
        const { rewardId } = req.params

        console.log(`from the controller ${rewardId}`);

        await rewardService.deleteReward(rewardId);

        res.status(201).json({ message: 'Reward deleted successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}