const Reward = require('../models/Reward.js');

exports.getAllRewards = async (guardianId) => {
    const rewards = await Reward.find({ guardianId });

    return rewards;
};

exports.createReward = async ({ name, price, type, redemptionLimit, guardianId }) => {

    const reward = await Reward.create({
       name,
       price,
       type,
       redemptionLimit,
       guardianId
    });

    return reward;
};

exports.getReward = async (rewardId) => {
    const reward = Reward.findById(rewardId);

    return reward;
};

exports.editReward = async (rewardId, updatedFields) => {

    const reward = await Reward.findByIdAndUpdate(rewardId, updatedFields);

    if (!reward) throw new Error("Reward not found");

    const updatedReward = await Reward.findById(rewardId);

    if (!updatedReward) throw new Error("Updated reward not found");

    return updatedReward;

};

exports.deleteReward = async (rewardId) => {

    await Reward.findByIdAndDelete(rewardId);


};