const rewardService = require('../services/rewardService.js');
const { createRewardSchema, updateRewardSchema } = require('../lib/joischemas/rewardJoi.js');

exports.getAllRewards = async (req, res) => {
    try {

        const guardianId = req.user.guardianId;

        const rewardsArray = await rewardService.getAllRewards(guardianId);

        res.status(200).json({ message: 'Rewards fetched successfully', rewardsArray });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createReward = async (req, res) => {

    try {

        await createRewardSchema.validateAsync(req.body);

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

};

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
};

exports.editReward = async (req, res) => {
    try {

        const { rewardId } = req.params

        const existingReward = await rewardService.getReward(rewardId);

        if (!existingReward) {
            return res.status(404).json({ error: "Reward not found" });
        }

        const { _id, __v, redemptionCount, guardianId, active, ...cleanedReward } = existingReward.toObject();

        if (req.body.type === 'forever') {
            delete cleanedReward.redemptionLimit;
        }

        const dataToValidate = {
            ...cleanedReward,
            ...req.body
        }

        await updateRewardSchema.validateAsync(dataToValidate);

        const updatedReward = await rewardService.editReward(rewardId, req.body);

        return res.status(200).json({ message: "Reward updated successfully", updatedReward });


    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.deleteReward = async (req, res) => {
    try {
        const { rewardId } = req.params

        await rewardService.deleteReward(rewardId);

        res.status(200).json({ message: 'Reward deleted successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.redeemReward = async (req, res) => {
    try {
        const { rewardId } = req.params;
        const kidId = req.user.kidId;

        const redeemedReward = await rewardService.redeemReward(rewardId, kidId);

        res.status(200).json({
            message: "Reward redeemed successfully",
            redeemedReward
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.confirmRedeemedReward = async (req, res) => {
    try {
        const { redeemedRewardId } = req.params;

        const updatedReward = await rewardService.confirmRedeemedReward(redeemedRewardId);

        res.status(200).json({
            message: "Reward confirmed successfully",
            updatedReward
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUnconfirmedRewards = async (req, res) => {
    try {
        const guardianId = req.user.guardianId;

        if (!guardianId) {
            return res.status(400).json({ error: "Guardian ID not found in token" });
        }

        const redeemedRewards = await rewardService.getAllUnconfirmedRedeemedRewards(guardianId);

        res.status(200).json({ redeemedRewards });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
