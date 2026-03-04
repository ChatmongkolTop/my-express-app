const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../plugins/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const SECRET_KEY = process.env.JWT_SECRET || 'my-secret-key-1234';

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, 'Email and password are required.', 400);
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return sendError(res, 'Invalid credentials', 401);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return sendError(res, 'Invalid credentials', 401);
        }

        // สร้าง Token โดยใส่ข้อมูลที่จำเป็นลงไป
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        
        sendSuccess(res, { token: token }, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        sendError(res, 'Internal server error');
    }
};