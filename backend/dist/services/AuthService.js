"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const models_1 = require("../models");
const tokens_1 = require("../utils/tokens");
const errors_1 = require("../utils/errors");
const env_1 = require("../config/env");
const sequelize_1 = require("sequelize");
class AuthService {
    async login(email, password) {
        const user = await models_1.User.findOne({ where: { email: email.toLowerCase() } });
        if (!user || !user.isActive || !user.password) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        const valid = await argon2_1.default.verify(user.password, password);
        if (!valid) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        const payload = {
            userId: user.id,
            role: user.role,
            email: user.email,
        };
        const accessToken = (0, tokens_1.signAccessToken)(payload);
        const refreshToken = (0, tokens_1.signRefreshToken)(payload);
        // Store refresh token
        const expiresAt = new Date();
        const days = parseInt(env_1.env.REFRESH_TOKEN_EXPIRES_IN) || 7;
        expiresAt.setDate(expiresAt.getDate() + days);
        await models_1.RefreshToken.create({
            userId: user.id,
            token: refreshToken,
            expiresAt,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
            },
            accessToken,
            refreshToken,
        };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = (0, tokens_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw new errors_1.UnauthorizedError('Invalid refresh token');
        }
        const stored = await models_1.RefreshToken.findOne({
            where: {
                token: refreshToken,
                userId: payload.userId,
                isRevoked: false,
                expiresAt: { [sequelize_1.Op.gt]: new Date() },
            },
        });
        if (!stored) {
            throw new errors_1.UnauthorizedError('Refresh token revoked or expired');
        }
        const user = await models_1.User.findByPk(payload.userId);
        if (!user || !user.isActive) {
            throw new errors_1.UnauthorizedError('User not found or inactive');
        }
        // Revoke old token (rotation)
        stored.isRevoked = true;
        await stored.save();
        const newPayload = {
            userId: user.id,
            role: user.role,
            email: user.email,
        };
        const newAccessToken = (0, tokens_1.signAccessToken)(newPayload);
        const newRefreshToken = (0, tokens_1.signRefreshToken)(newPayload);
        const expiresAt = new Date();
        const days = parseInt(env_1.env.REFRESH_TOKEN_EXPIRES_IN) || 7;
        expiresAt.setDate(expiresAt.getDate() + days);
        await models_1.RefreshToken.create({
            userId: user.id,
            token: newRefreshToken,
            expiresAt,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
            },
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    async logout(refreshToken) {
        if (refreshToken) {
            await models_1.RefreshToken.update({ isRevoked: true }, { where: { token: refreshToken } });
        }
    }
    async getMe(userId) {
        const user = await models_1.User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt'],
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return user;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=AuthService.js.map