"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const env_1 = require("../config/env");
function errorHandler(err, _req, res, _next) {
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
        });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }
    // Multer errors
    if (err.name === 'MulterError') {
        res.status(400).json({
            success: false,
            message: err.message || 'File upload error',
        });
        return;
    }
    console.error('[Error]', err.message);
    if (env_1.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    res.status(500).json({
        success: false,
        message: env_1.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
}
function notFoundHandler(_req, res) {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
}
//# sourceMappingURL=errorHandler.js.map