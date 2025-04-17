exports.allowOnly = (allowedRoles) => {
    return (req, res, next) => {
        const currentProfile = req.user.profileType;
        if(!allowedRoles.includes(currentProfile)) {
            return res.status(403).json({ error: 'Access denied for this profile' })
        } next();

    };
};