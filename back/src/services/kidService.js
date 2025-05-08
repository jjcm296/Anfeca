const Kid = require('../models/Kid.js');

async function findKidOrThrow(kidId) {
    const kid = await Kid.findById(kidId);
    if (!kid) throw new Error("Kid not found");
    return kid;
}


exports.createKidProfile = async ({ name, guardianId }) => {

    const kid = await Kid.create({ name, guardianId});

    return kid;
};

exports.getKid = async (kidId) => {

    const kid = await Kid.findById(kidId);

    if (!kid) throw new Error("Kid not found");

    return kid;

};

exports.getKidByGuardianId = async (guardianId) => {

    const kid = await Kid.findOne({ guardianId }).select(' -guardianId');

    if (!kid) throw new Error("Kid not found");

    return kid;

};

exports.getStreak = async (kidId) => {
    const kid = await Kid.findById(kidId);

    if (!kid) throw new Error("Kid not found");

    return kid.streak;
}

exports.getCoins = async (kidId) => {
    const kid = await Kid.findById(kidId);

    if (!kid) throw new Error("Kid not found");

    return kid.coins;
}

exports.addCoins = async (kidId, amount) => {
    const kid = await findKidOrThrow(kidId);
    kid.coins += amount;
    await kid.save();

    return kid.coins;
}

exports.substractCoins = async (kidId, amount) => {
    const kid = await findKidOrThrow(kidId);
    if (kid.coins < amount) throw new Error("Insufficient coins");
    kid.coins -= amount;
    await kid.save();

    return kid.coins;
}