const Reward = require('../models/Reward.js');

exports.createReward = async ({ name, price, type, redemptionLimit, guardianId }) => {

    const reward = await Reward.create({
       name,
       price,
       type,
       redemptionLimit,
       guardianId
    });

    return reward;
}

exports.getReward = async (rewardId) => {
    const reward = Reward.findById(rewardId);

    return reward;
}

exports.deleteReward = async (rewardId) => {

    await Reward.findByIdAndDelete(rewardId);


}