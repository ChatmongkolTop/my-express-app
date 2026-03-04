const db = require('../plugins/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = async () => {
    const [rows] = await db.query('SELECT id, uid, email, name, phone, role, created_at FROM users');
    return rows;
};

exports.createUser = async (userData) => {
    const { email, password, name, role = 2 } = userData; // Default role to user

    // Check if email already exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
        const error = new Error('This email is already in use.');
        error.code = 409; // Conflict
        throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        uid: uuidv4(),
        email,
        password: hashedPassword,
        name,
        role
    };

    const [result] = await db.query('INSERT INTO users (uid, email, password, name, role, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [newUser.uid, newUser.email, newUser.password, newUser.name, newUser.role, 1, 1]); // หมายเหตุ: created_by, updated_by ควรมาจากข้อมูล user ที่ login อยู่

    delete newUser.password;
    return { id: result.insertId, ...newUser };
};

exports.getUserById = async (id) => {
    const [rows] = await db.query('SELECT id, uid, email, name, phone, role, created_at FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
        const error = new Error('User not found.');
        error.code = 404; // Not Found
        throw error;
    }
    return rows[0];
};
