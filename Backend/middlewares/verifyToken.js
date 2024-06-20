const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).send({ message: "Please login to continue" });
    }
    const token = bearerToken.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).send({ message: "Invalid or expired token" });
    }
}


module.exports = verifyToken;
