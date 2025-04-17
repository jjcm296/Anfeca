const generateGuardianPayload = (accountId, guardianId, profileType) => {
    return {
        id: accountId,
        guardianId: guardianId,
        profileType: profileType
    }
};

const generateKidPayload = (accountId, guardianId, kidId, profileType) => {
    return {
        id: accountId,
        guardianId: guardianId,
        kidId: kidId,
        profileType: profileType
    }
};

module.exports = {
    generateGuardianPayload,
    generateKidPayload
}