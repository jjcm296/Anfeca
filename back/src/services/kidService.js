const Kid = require('../models/Kid.js');

exports.createKidProfile = async ({ name, guardianId }) => {

    const kid = await Kid.create({ name, guardianId});

    return kid;
};

exports.getKid = async (kidId) => {

    const kid = await Kid.findById(kidId).select('-_id -guardianId');

    if (!kid) throw new Error("Kid not found");

    return kid;

};

exports.getKidByGuardianId = async (guardianId) => {

    const kid = await Kid.findOne({ guardianId }).select('-_id -guardianId');

    if (!kid) throw new Error("Kid not found");

    return kid;

};