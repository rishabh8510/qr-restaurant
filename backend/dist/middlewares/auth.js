"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuth = optionalAuth;
exports.authorize = authorize;
const tokens_1 = require("../utils/tokens");
const errors_1 = require("../utils/errors");
function authenticate(req, _res, next) {
    try {
        let token = req.cookies?.accessToken;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }
        if (!token) {
            throw new errors_1.UnauthorizedError('Authentication required');
        }
        const payload = (0, tokens_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch {
        next(new errors_1.UnauthorizedError('Invalid or expired access token'));
    }
}
/** Optional auth – attaches user if token present, otherwise continues */
function optionalAuth(req, _res, next) {
    try {
        let token = req.cookies?.accessToken;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }
        if (token) {
            const payload = (0, tokens_1.verifyAccessToken)(token);
            req.user = payload;
        }
    }
    catch {
        // ignore invalid token for optional
    }
    next();
}
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errors_1.UnauthorizedError('Authentication required'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.ForbiddenError('You do not have permission to perform this action'));
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map