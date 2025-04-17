const accountService = require('../services/accountService.js');
const jwtUtils = require('../lib/auth/jwtUtils.js');
const kidService = require('../services/kidService.js');
const { generateGuardianPayload, generateKidPayload } = require('../lib/auth/payload.js');

exports.switchProfile = async (req, res) => {
    const { targetProfile, password } = req.body;
    const { id, guardianId, profileType } = req.user;
    let payload;
    let newAccessToken;

    // from kid to guardian
    if (targetProfile === "guardian") {

        if (profileType !== "kid") {
            return res.status(400).json({ error: 'Already in guardian profile' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required to switch to guardian profile' });
        }

        if (!await accountService.checkPassword(password, id)) {
            return res.status(400).json({ error: 'Password incorrect' });
        }

        payload = generateGuardianPayload(id, guardianId, "guardian");

        newAccessToken = jwtUtils.generateAccesToken(payload);

        return res.status(200).json({ message: 'Switched to guardian profile successfully', token: newAccessToken });

    } else if (targetProfile === "kid") { // from guardian to kid

        if (profileType !== "guardian") {
            return res.status(400).json({ error: 'Already in kid profile' });
        }

        const kid = await kidService.getKid(guardianId);

        payload = generateKidPayload(id, guardianId, kid._id, "kid");
        newAccessToken = jwtUtils.generateAccesToken(payload);

        return res.status(200).json({ message: 'Switched to kid profile successfully', newAccessToken });

    } else {
        return res.status(400).json({ error: 'Invalid profile switch request' });
    }


};

exports.getCurrentProfile = async (req, res) => {
    const { profileType } = req.user;

    console.log(req.user)

    try {

        if (!profileType) throw new Error("profile type not extracted");

        res.status(200).json({ message: `The current profile is ${profileType}`  });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};