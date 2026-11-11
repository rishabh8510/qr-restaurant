"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsToken = exports.verifyOtp = exports.sendOtp = exports.me = exports.logout = exports.refresh = exports.login = void 0;
const AuthService_1 = require("../services/AuthService");
const auth_validator_1 = require("../validators/auth.validator");
const env_1 = require("../config/env");
const asyncHandler_1 = require("../utils/asyncHandler");
const cookieOptions = {
    httpOnly: true,
    secure: env_1.env.COOKIE_SECURE,
    sameSite: env_1.env.COOKIE_SAME_SITE,
    domain: env_1.env.COOKIE_DOMAIN === 'localhost' ? undefined : env_1.env.COOKIE_DOMAIN,
    path: '/',
};
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_validator_1.loginSchema.parse(req.body);
    const result = await AuthService_1.authService.login(input.email, input.password);
    res.cookie('accessToken', result.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 min
    });
    res.cookie('refreshToken', result.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
        success: true,
        data: { user: result.user },
    });
});
// export const refresh = asyncHandler(async (req, res) => {
//   const refreshToken = req.cookies?.refreshToken;
//   if (!refreshToken) {
//     res.status(401).json({ success: false, message: 'No refresh token' });
//     return;
//   }
//   const result = await authService.refresh(refreshToken);
//   res.cookie('accessToken', result.accessToken, {
//     ...cookieOptions,
//     maxAge: 15 * 60 * 1000,
//   });
//   res.cookie('refreshToken', result.refreshToken, {
//     ...cookieOptions,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
//   res.json({
//     success: true,
//     data: { user: result.user },
//   });
// });
exports.refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        (req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.slice(7)
            : null);
    if (!refreshToken) {
        res.status(401).json({ success: false, message: 'No refresh token' });
        return;
    }
    const result = await AuthService_1.authService.refresh(refreshToken);
    res.cookie('accessToken', result.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
        success: true,
        data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        },
    });
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    await AuthService_1.authService.logout(refreshToken);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.json({ success: true, message: 'Logged out successfully' });
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await AuthService_1.authService.getMe(req.user.userId);
    res.json({ success: true, data: user });
});
const OtpService_1 = require("../services/OtpService");
const zod_1 = require("zod");
const sendOtpSchema = zod_1.z.object({
    phone: zod_1.z.string().min(10).max(20),
});
const verifyOtpSchema = zod_1.z.object({
    phone: zod_1.z.string().min(10).max(20),
    code: zod_1.z.string().length(6),
    name: zod_1.z.string().max(100).optional(),
});
exports.sendOtp = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { phone } = sendOtpSchema.parse(req.body);
    const result = await OtpService_1.otpService.sendOtp(phone);
    res.json({ success: true, ...result });
});
exports.verifyOtp = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = verifyOtpSchema.parse(req.body);
    const result = await OtpService_1.otpService.verifyOtp(input.phone, input.code, input.name);
    // Also set cookies for same-origin if needed
    res.cookie('accessToken', result.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
        success: true,
        data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        },
    });
});
/** Returns a short-lived access token for WebSocket handshake (cookie-authenticated sessions). */
exports.wsToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { signAccessToken } = await Promise.resolve().then(() => __importStar(require('../utils/tokens')));
    const token = signAccessToken({
        userId: user.userId,
        role: user.role,
        email: user.email,
        phone: user.phone,
    });
    res.json({ success: true, data: { token } });
});
//# sourceMappingURL=auth.controller.js.map