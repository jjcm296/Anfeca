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

exports.deleteReward = async (rewardId) => {

    const reward = await Reward.findById(rewardId);

    console.log(`from the service ${rewardId}`);
    console.log(reward);


}