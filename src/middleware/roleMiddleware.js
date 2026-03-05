const { sendError } = require('../utils/responseHelper');

/**
 * Middleware สำหรับตรวจสอบ Role ของผู้ใช้
 * @param {string[]} requiredRoles - รายชื่อ Role ที่อนุญาตให้เข้าถึง
 * @returns {function} Express middleware function
 */
const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            return sendError(res, `Access Denied: Requires one of the following roles: ${requiredRoles.join(', ')}`, 403);
        }
        next();
    };
};

module.exports = checkRole;