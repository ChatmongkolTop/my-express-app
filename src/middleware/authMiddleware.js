const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHelper');

// ในการใช้งานจริง ควรเก็บ Secret Key ไว้ใน .env
const SECRET_KEY = process.env.JWT_SECRET || 'my-secret-key-1234';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return sendError(res, 'Access Denied: No Token Provided', 401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return sendError(res, 'Invalid Token', 403);
        req.user = user;
        next();
    });
};