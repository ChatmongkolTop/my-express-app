const { sendError } = require('../utils/responseHelper');

/**
 * Middleware สำหรับตรวจสอบ Role ของผู้ใช้
 * @param {string[]} requiredRoles - รายชื่อ Role ที่อนุญาตให้เข้าถึง
 * @returns {function} Express middleware function
 */
const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            return sendError(res, res.__('ACCESS_DENIED_ROLE', requiredRoles.join(', ')), 403);
        }
        next();
    };
};

module.exports = checkRole;