const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({
            message: 'No token, authorization denied'
        });
    }

    const token = authHeader.replace('Bearer ', '');

    try {

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {

        console.error("JWT Error:", err.message);

        return res.status(401).json({
            message: 'Token is not valid'
        });

    }
};