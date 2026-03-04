const { v4: uuidv4 } = require('uuid');

exports.sendSuccess = (res, data, message = 'succeed', httpStatus = 200) => {
    res.status(httpStatus).json({
        code: '00',
        message: message,
        request_id: uuidv4(),
        response: data || {}
    });
};

exports.sendError = (res, message = 'Error', httpStatus = 500) => {
    res.status(httpStatus).json({
        code: '10',
        message: message,
        request_id: uuidv4(),
        response: {}
    });
};