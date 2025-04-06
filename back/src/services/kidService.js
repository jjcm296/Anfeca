const Kid = require('../models/Kid.js');
const Guardian = require('../models/Guardian.js');

exports.createKidProfile = async ({ name, guardianId }) => {

    const kid = await Kid.create({ name, guardianId});

    return { kid };
}