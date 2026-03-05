const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
*       required:
*         - id
*         - email
*         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id
 *         name:
 *           type: string
 *           description: The user name
*         email:
*           type: string
*           description: The user email
 *         role:
 *           type: string
 *           description: The user role name
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns the list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', authMiddleware, userController.getUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*             type: object
*             required:
*               - email
*               - password
*               - name
*             properties:
*               email:
*                 type: string
*               password:
*                 type: string
*               name:
*                 type: string
 *     responses:
 *       201:
 *         description: The user was successfully created
 */
router.post('/', userController.createUser);

module.exports = router;
