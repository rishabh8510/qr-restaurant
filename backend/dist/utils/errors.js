"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.ConflictError = exports.ValidationError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    code;
    constructor(message, statusCode = 500, isOperational = true, code) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, true, 'UNAUTHORIZED');
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, true, 'FORBIDDEN');
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, true, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 400, true, 'VALIDATION_ERROR');
    }
}
exports.ValidationError = ValidationError;
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409, true, 'CONFLICT');
    }
}
exports.ConflictError = ConflictError;
class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400, true, 'BAD_REQUEST');
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=errors.js.map