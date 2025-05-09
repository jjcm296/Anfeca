const accountService = require('../services/accountService.js');
const jwtUtils = require('../lib/auth/jwtUtils.js');
const kidService = require('../services/kidService.js');
const guardianService = require('../services/guardianService.js');
const Session = require('../models/Session.js');
const { generateGuardianPayload, generateKidPayload } = require('../lib/auth/payload.js');

exports.switchProfile = async (req, res) => {
    const { targetProfile, password } = req.body;
    const { id, guardianId, profileType } = req.user;

    if (!guardianId) {
        return res.status(400).json({ error: 'guardianId is missing from the current session' });
    }

    let payload;
    let newAccessToken;
    let newRefreshToken;

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
        newRefreshToken = jwtUtils.generateRefreshToken(payload);

        // change this later to sessionService
        // Update the existing session
        await Session.findOneAndUpdate(
            { accountId: id },
            {
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + jwtUtils.parseExpiration(process.env.JWT_REFRESH_EXPIRES_IN))
            }
        );

        return res.status(200).json({ message: 'Switched to guardian profile successfully', newAccessToken, newRefreshToken });

    } else if (targetProfile === "kid") { // from guardian to kid

        if (profileType !== "guardian") {
            return res.status(400).json({ error: 'Already in kid profile' });
        }

        const kid = await kidService.getKidByGuardianId(guardianId);

        payload = generateKidPayload(id, guardianId, kid._id, "kid");
        newAccessToken = jwtUtils.generateAccesToken(payload);
        newRefreshToken = jwtUtils.generateRefreshToken(payload);

        // change this later to sessionService
        // Update the existing session
        await Session.findOneAndUpdate(
            { accountId: id },
            {
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + jwtUtils.parseExpiration(process.env.JWT_REFRESH_EXPIRES_IN))
            }
        );

        return res.status(200).json({ message: 'Switched to kid profile successfully', newAccessToken, newRefreshToken });

    } else {
        return res.status(400).json({ error: 'Invalid profile switch request' });
    }


};

exports.getCurrentProfile = async (req, res) => {
    let profile;

    try {

        const { guardianId, profileType } = req.user;


        if (!profileType) throw new Error("profile type not extracted");

        if (profileType === "guardian") {
            profile = await guardianService.getGuardian(guardianId);

        } else if (profileType === "kid") {

            profile = await kidService.getKidByGuardianId(guardianId);

        } else {
            throw new Error("Trouble in account controller, fetching profile failed ");
        }

        res.status(200).json({ message: `The current profile is ${profileType}`, profile  });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

exports.getProfilesNames = async (req, res) => {

    try {
        const { guardianId } = req.user;

        const guardian = await guardianService.getGuardian(guardianId);
        const kid = await kidService.getKidByGuardianId(guardianId);

        if (!guardian || !kid) throw new Error("Couldn't fetch profiles");

        const profilesNames = {
            guardian: guardian.name,
            kid: kid.name
        }

        return res.status(200).json({ message: "Profiles' names fetched successfully", profilesNames });



    } catch (error) {
        return res.status(400).json({ error: error.message });
    }


};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.user; // from JWT payload
        await accountService.deleteAccount(id);
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}