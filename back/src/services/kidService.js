const Kid = require('../models/Kid.js');

exports.createKidProfile = async ({ name, guardianId }) => {

    const kid = await Kid.create({ name, guardianId});

    return kid;
};

exports.getKid = async (guardianId) => {

    const kid = await Kid.findOne({ guardianId });

    if (!kid) throw new Error("Kid not found");

    return kid;

};