const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../plugins/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const userService = require('../services/userService');
const swaggerTokenStore = require('../utils/swaggerTokenStore');

const SECRET_KEY = process.env.JWT_SECRET || 'my-secret-key-1234';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'my-refresh-secret-key-456';
const ACCESS_TOKEN_LIFE = process.env.JWT_ACCESS_EXPIRATION || '1h';
const REFRESH_TOKEN_LIFE = process.env.JWT_REFRESH_EXPIRATION || '7d';

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, res.__('AUTH_REQUIRED'), 400);
    }

    try {
        const [userRows] = await db.query(
            'SELECT u.*, sr.name as role FROM users u LEFT JOIN setting_role sr ON u.role_id = sr.id WHERE u.email = ?',
            [email]
        );
        const user = userRows[0];

        if (!user) {
            return sendError(res, res.__('INVALID_CREDENTIALS'), 401, 'AUTH_001');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return sendError(res, res.__('INVALID_CREDENTIALS'), 401, 'AUTH_001');
        }

        // Get permissions
        const [permissionRows] = await db.query(
            'SELECT child FROM auth_item_child WHERE role_id = ?',
            [user.role_id]
        );
        const permissions = permissionRows.map(p => p.child);

        // Payload สำหรับ Token
        const payload = { id: user.id, email: user.email, role: user.role };

        // สร้าง Access Token และ Refresh Token
        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_LIFE });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_LIFE });
        
        // เก็บข้อมูล Refresh Token ลง Database
        const decodedRefreshToken = jwt.decode(refreshToken);
        const expiresAt = new Date(decodedRefreshToken.exp * 1000);
        const userAgent = req.headers['user-agent'] || 'Unknown';
        let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

        // จัดการรูปแบบ IP Address ให้เป็น IPv4 ที่คุ้นเคย
        if (ipAddress === '::1') {
            ipAddress = '127.0.0.1';
        } else if (ipAddress && ipAddress.startsWith('::ffff:')) {
            ipAddress = ipAddress.replace('::ffff:', '');
        }

        await db.query(
            'INSERT INTO users_refresh_tokens (user_id, token, device_info, ip_address, expires_at) VALUES (?, ?, ?, ?, ?)',
            [user.id, refreshToken, userAgent, ipAddress, expiresAt]
        );

        sendSuccess(res, {
            name: user.name,
            role: user.role,
            access_token: accessToken,
            refresh_token: refreshToken,
            permissions: permissions
        }, res.__('LOGIN_SUCCESS'), 200, 'LOGIN_SUCCESS');

    } catch (error) {
        console.error('Login error:', error);
        sendError(res, res.__('INTERNAL_ERROR'));
    }
};

exports.refreshToken = async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) return sendError(res, res.__('REFRESH_TOKEN_REQUIRED'), 400, 'AUTH_002');

    try {
        const decoded = jwt.verify(refresh_token, REFRESH_SECRET_KEY);

        // ตรวจสอบใน Database ว่า Token นี้ถูก Revoke หรือไม่
        const [storedTokens] = await db.query('SELECT * FROM users_refresh_tokens WHERE token = ?', [refresh_token]);
        const storedToken = storedTokens[0];

        if (!storedToken || storedToken.is_revoked) {
            return sendError(res, res.__('INVALID_REFRESH_TOKEN'), 403, 'AUTH_003');
        }

        const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_LIFE });

        sendSuccess(res, { access_token: accessToken }, res.__('REFRESH_SUCCESS'), 200, 'REFRESH_SUCCESS');
    } catch (error) {
        return sendError(res, res.__('INVALID_REFRESH_TOKEN'), 403, 'AUTH_003');
    }
};

exports.logout = async (req, res) => {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
        // ถ้าไม่มี Token ส่งมา ก็ถือว่า Logout สำเร็จ (Client ลบของตัวเองทิ้ง)
        return sendSuccess(res, null, res.__('LOGOUT_SUCCESS'), 200, 'LOGOUT_SUCCESS');
    }

    // Revoke Token ใน Database
    await db.query('UPDATE users_refresh_tokens SET is_revoked = 1 WHERE token = ?', [refresh_token]);
    sendSuccess(res, null, res.__('LOGOUT_SUCCESS'), 200, 'LOGOUT_SUCCESS');
};

exports.getMe = async (req, res) => {
    try {
        // req.user is populated by authMiddleware from the token
        const userId = req.user.id;
        const user = await userService.getUserById(userId);
        sendSuccess(res, user, res.__('USER_PROFILE_SUCCESS'), 200, 'USER_PROFILE_SUCCESS');
    } catch (error) {
        const httpStatus = error.statusCode || 500;
        sendError(res, res.__(error.message), httpStatus);
    }
};

exports.generateSwaggerGuestPassword = (req, res) => {
    try {
        const guestPassword = swaggerTokenStore.generate();
        sendSuccess(res, { username: 'guest', password: guestPassword, expires_in_minutes: 15 }, res.__('GUEST_PASSWORD_SUCCESS'), 200, 'GUEST_PASSWORD_SUCCESS');
    } catch (error) {
        console.error('Error generating Swagger guest password:', error);
        sendError(res, res.__('GUEST_PASSWORD_ERROR'));
    }
};