const userService = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        sendSuccess(res, users);
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        sendSuccess(res, newUser, 'succeed', 201);
    } catch (error) {
        const httpStatus = error.code || 500;
        sendError(res, error.message, httpStatus);
    }
};
