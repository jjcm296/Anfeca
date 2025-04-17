const Guardian = require('../models/Guardian');

exports.getGuardian = async (guardianId) => {

    const guardian = await Guardian.findById(guardianId).select('-_id');

    if (!guardian) throw new Error("Guardian not found");

    return guardian;

}