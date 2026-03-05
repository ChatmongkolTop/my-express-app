const guestTokenStore = require('../utils/swaggerTokenStore');

module.exports = (req, res, next) => {
    // แนะนำให้เก็บรหัสผ่าน Admin ไว้ใน .env เพื่อความปลอดภัย
    const adminUser = process.env.SWAGGER_ADMIN_USER || 'admin';
    const adminPassword = process.env.SWAGGER_ADMIN_PASSWORD || 'supersecret'; // ควรเปลี่ยนรหัสนี้
    const guestUser = 'guest';

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Swagger Protected Area"');
        return res.status(401).send('Authentication required');
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const inputUser = auth[0];
    const inputPassword = auth[1];

    // ตรวจสอบว่าเป็น Admin หรือไม่
    if (inputUser === adminUser && inputPassword === adminPassword) {
        return next();
    }

    // ตรวจสอบว่าเป็น Guest และรหัสถูกต้องหรือไม่
    if (inputUser === guestUser && guestTokenStore.validate(inputPassword)) {
        return next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Swagger Protected Area"');
        return res.status(401).send('Invalid credentials');
    }
};