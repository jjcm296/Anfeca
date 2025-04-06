const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.split(' ')[1]; // split "Bearer <token>" into ["Bearer", "<token>"]
    if (!token) {
        return res.status(401).json({
           error: 'Malformed authorization header'
        });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded; // gives access to the token payload to any route or middleware that runs afterward.
        next();
    } catch {
        return res.status(403).json({ error: 'Invalid or expired token' })
    }
}