const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../plugins/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const userService = require('../services/userService');
const swaggerTokenStore = require('../utils/swaggerTokenStore');

const SECRET_KEY = process.env.JWT_SECRET || 'my-secret-key-1234';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'my-refresh-secret-key-456';
const ACCESS_TOKEN_LIFE = '1h';   // อายุ Access Token (1 ชั่วโมง)
const REFRESH_TOKEN_LIFE = '7d';  // อายุ Refresh Token (7 วัน)

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, 'Email and password are required.', 400);
    }

    try {
        const [userRows] = await db.query(
            'SELECT u.*, sr.name as role FROM users u LEFT JOIN setting_role sr ON u.role_id = sr.id WHERE u.email = ?',
            [email]
        );
        const user = userRows[0];

        if (!user) {
            return sendError(res, 'Invalid credentials', 401);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return sendError(res, 'Invalid credentials', 401);
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
        
        sendSuccess(res, {
            id: user.id,
            name: user.name,
            role: user.role,
            access_token: accessToken,
            refresh_token: refreshToken,
            permissions: permissions
        }, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        sendError(res, 'Internal server error');
    }
};

exports.refreshToken = async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) return sendError(res, 'Refresh Token is required', 400);

    try {
        const decoded = jwt.verify(refresh_token, REFRESH_SECRET_KEY);
        const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_LIFE });

        sendSuccess(res, { access_token: accessToken }, 'Token refreshed successfully');
    } catch (error) {
        return sendError(res, 'Invalid or Expired Refresh Token', 403);
    }
};

exports.getMe = async (req, res) => {
    try {
        // req.user is populated by authMiddleware from the token
        const userId = req.user.id;
        const user = await userService.getUserById(userId);
        sendSuccess(res, user, 'User profile retrieved successfully');
    } catch (error) {
        const httpStatus = error.statusCode || 500;
        sendError(res, error.message, httpStatus);
    }
};

exports.generateSwaggerGuestPassword = (req, res) => {
    try {
        const guestPassword = swaggerTokenStore.generate();
        sendSuccess(res, { username: 'guest', password: guestPassword, expires_in_minutes: 15 }, 'Swagger guest password generated successfully.');
    } catch (error) {
        console.error('Error generating Swagger guest password:', error);
        sendError(res, 'Could not generate guest password.');
    }
};