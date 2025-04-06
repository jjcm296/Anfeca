const Kid = require('../models/Kid.js');

exports.createKidProfile = async ({ name, guardianId }) => {

    const kid = await Kid.create({ name, guardianId});

    return { kid };
}