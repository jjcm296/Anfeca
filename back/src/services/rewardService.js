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