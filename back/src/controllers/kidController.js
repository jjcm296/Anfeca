const kidService = require('../services/kidService.js');

exports.createKid = async (req, res) => {
    try {
        const guardianId = req.user.guardianId; // extracted from the token
        const { name } = req.body;

        const kid  = await kidService.createKidProfile({ name, guardianId });
        res.status(201).json({ message: "Kid created successfully", kid })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/*
exports.createKid = async (req, res) => {
  const guardianId = req.user.guardianId;

  const kid = await Kid.create({
    name: req.body.name,
    guardianId
  });

  res.status(201).json({ message: 'Kid created', kid });
};

 */