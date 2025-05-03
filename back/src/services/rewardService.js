const Reward = require('../models/Reward.js');

exports.getAllRewards = async (guardianId) => {
    const rewards = await Reward.find({ guardianId });

    return rewards;
};

exports.createReward = async ({ name, price, type, redemptionLimit, guardianId }) => {

    const duplicatedReward = await Reward.find({ name, price, type, redemptionLimit, guardianId });

    if (duplicatedReward > 0) throw Error("The same exact reward already exists");

    await Reward.create({ name, price, type, redemptionLimit, guardianId });

    const reward = await Reward.findOne({ name, price, type, redemptionLimit, guardianId }).lean();

    return reward;
};

exports.getReward = async (rewardId) => {
    const reward = await Reward.findById(rewardId);

    return reward;
};

exports.editReward = async (rewardId, updatedFields) => {

    const reward = await Reward.findById(rewardId);

    if (!reward) throw new Error("Reward not found");

    // assign changes to found reward body
    Object.assign(reward, updatedFields)

    // validate with personalized and pre validations (mongoose)
    await reward.validate();

    // save in the database
    await reward.save();

    return reward;
};

exports.deleteReward = async (rewardId) => {

    await Reward.findByIdAndDelete(rewardId);


};