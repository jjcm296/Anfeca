const Reward = require('../models/Reward.js');

exports.createReward = async ({ name, type, redemptionLimit, guardianId }) => {

    const reward = await Reward.create({
       name,
       type,
       redemptionLimit,
       guardianId
    });

    return reward;

}