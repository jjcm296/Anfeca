const Reward = require('../models/Reward.js');
const RedeemedReward = require('../models/RedeemedReward.js');
const kidService = require('./kidService.js');
const redeemedRewardSchemaJoi =require('../lib/joischemas/redeemedRewardJoi.js');


async function findRewardOrThrow(rewardId) {
    const reward = await Reward.findById(rewardId);
    if (!reward) throw new Error("Reward not found");
    return reward;
}

async function createRedeemedReward(rewardId, guardianId) {
    return await RedeemedReward.create({ rewardId, guardianId });
}


exports.getAllRewards = async (guardianId) => {
    const rewards = await Reward.find({ guardianId });

    return rewards;
};

exports.createReward = async ({ name, price, type, redemptionLimit, guardianId }) => {

    const duplicatedReward = await Reward.find({ name, price, type, guardianId });

    if (duplicatedReward > 0) throw Error("The same exact reward already exists");

    await Reward.create({ name, price, type, redemptionLimit, guardianId });

    const reward = await Reward.findOne({ name, price, type, guardianId }).lean();

    return reward;
};

exports.getReward = async (rewardId) => {
    const reward = await Reward.findById(rewardId);

    if (!reward) throw new Error("Reward not found");

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

exports.redeemReward = async (rewardId, kidId) => {
    const reward = await findRewardOrThrow(rewardId);
    const kid = await kidService.getKid(kidId);

    const guardianId = kid.guardianId;

    // check coin balance before anything
    if (kid.coins < reward.price) throw new Error("Insufficient coins");

    // check if the reward is active
    if (!reward.active) throw new Error("This reward can no longer be redeemed; it has reached its redemption limit.");

    // create new redeemed reward document
    const redeemedReward = await createRedeemedReward(rewardId, guardianId);
    if (!redeemedReward) throw new Error("The reward wasn't redeemed");

    // modify redemption count
    reward.redemptionCount += 1;
    if (reward.redemptionLimit !== undefined && reward.redemptionLimit <= reward.redemptionCount) reward.active = false;
    await reward.save();

    // decrease coins
    await kidService.substractCoins(kidId, reward.price);

    return {
        _id: redeemedReward._id,
        redeemDate: redeemedReward.redeemDateFormatted,
        confirm: redeemedReward.confirm,
        rewardId: redeemedReward.rewardId
    };
}

exports.confirmRedeemedReward = async (redeemedRewardId) => {
    const redeemedReward = await RedeemedReward.findById(redeemedRewardId);

    if (!redeemedReward) throw new Error("The redeemed reward not found");

    if (redeemedReward.confirm || redeemedReward.confirmDate) throw new Error("This reward has already been checked");

    redeemedReward.confirmDate = new Date();
    redeemedReward.confirm = true;

    await redeemedReward.save();

    return {
        _id: redeemedReward._id,
        redeemDate: redeemedReward.redeemDateFormatted,
        confirm: redeemedReward.confirm,
        confirmDate: redeemedReward.confirmDateFormatted,
        rewardId: redeemedReward.rewardId
    };
};

exports.getAllUnconfirmedRedeemedRewards = async (guardianId) => {
    const allRedeemedRewards = await RedeemedReward.find({ guardianId, confirm: false }).populate('rewardId', 'name price');;

    if (allRedeemedRewards.length === 0) return "There aren't no rewards to confirm";

    const reedemedRewards = allRedeemedRewards.map(reward => ({
        _id: reward._id,
        rewardName: reward.rewardId.name,
        redeemDate: reward.redeemDateFormatted,
        confirm: reward.confirm
    }));

    return reedemedRewards;
}