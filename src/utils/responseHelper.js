const { v4: uuidv4 } = require('uuid');

exports.sendSuccess = (res, data, message = 'succeed', httpStatus = 200) => {
    res.status(httpStatus).json({
        success: true,
        code: '00',
        message: message,
        request_id: uuidv4(),
        data: data || {}
    });
};

exports.sendError = (res, error, httpStatus = 500, code = null) => {
    const message = (error && error.message) ? error.message : error;
    
    const defaultCodes = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        500: 'INTERNAL_SERVER_ERROR'
    };

    const errorCode = code || defaultCodes[httpStatus] || 'UNKNOWN_ERROR';

    res.status(httpStatus).json({
        success: false,
        request_id: uuidv4(),
        error: {
            code: errorCode,
            message: message
        }
    });
};