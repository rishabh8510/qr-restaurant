"use strict";
// import { Op } from 'sequelize';
// import { Otp, User, RefreshToken } from '../models';
// import { signAccessToken, signRefreshToken } from '../utils/tokens';
// import { env } from '../config/env';
// import { BadRequestError } from '../utils/errors';
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = exports.OtpService = void 0;
// const OTP_EXPIRY_MINUTES = 5;
// function generateOtpCode(): string {
//   return String(Math.floor(100000 + Math.random() * 900000));
// }
// export class OtpService {
//   async sendOtp(phone: string): Promise<{ message: string; debugCode?: string }> {
//     const normalized = phone.replace(/\D/g, '').slice(-10);
//     if (normalized.length < 10) {
//       throw new BadRequestError('Invalid phone number');
//     }
//     await Otp.update(
//       { verified: true },
//       { where: { phone: normalized, verified: false } }
//     );
//     const code = generateOtpCode();
//     const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
//     await Otp.create({
//       phone: normalized,
//       code,
//       expiresAt,
//       verified: false,
//     });
//     // TODO: integrate real SMS provider
//     console.log(`[OTP] Phone ${normalized} code: ${code}`);
//     return {
//       message: 'OTP sent successfully',
//       ...(env.NODE_ENV !== 'production' ? { debugCode: code } : {}),
//     };
//   }
//   async verifyOtp(phone: string, code: string, name?: string) {
//     const normalized = phone.replace(/\D/g, '').slice(-10);
//     if (normalized.length < 10) {
//       throw new BadRequestError('Invalid phone number');
//     }
//     const otp = await Otp.findOne({
//       where: {
//         phone: normalized,
//         code,
//         verified: false,
//         expiresAt: { [Op.gt]: new Date() },
//       },
//       order: [['createdAt', 'DESC']],
//     });
//     if (!otp) {
//       throw new BadRequestError('Invalid or expired OTP');
//     }
//     otp.verified = true;
//     await otp.save();
//     let user = await User.findOne({
//       where: { phone: normalized, role: 'customer' },
//     });
//     if (!user) {
//       user = await User.create({
//         name: name || `User ${normalized.slice(-4)}`,
//         phone: normalized,
//         email: null,
//         password: null,
//         role: 'customer',
//         isActive: true,
//       });
//     }
//     if (!user.isActive) {
//       throw new BadRequestError('Account is deactivated');
//     }
//     const payload = {
//       userId: user.id,
//       role: user.role as 'customer',
//       phone: user.phone,
//       email: user.email,
//     };
//     const accessToken = signAccessToken(payload);
//     const refreshToken = signRefreshToken(payload);
//     await RefreshToken.create({
//       userId: user.id,
//       token: refreshToken,
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     });
//     return {
//       accessToken,
//       refreshToken,
//       user: {
//         id: user.id,
//         name: user.name,
//         phone: user.phone,
//         email: user.email,
//         role: user.role,
//       },
//     };
//   }
// }
// export const otpService = new OtpService();
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const tokens_1 = require("../utils/tokens");
const errors_1 = require("../utils/errors");
const OTP_EXPIRY_MINUTES = 5;
function generateOtpCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}
/** Always last 10 digits */
function normalizePhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    return digits.slice(-10);
}
class OtpService {
    async sendOtp(phone) {
        const normalized = normalizePhone(phone);
        if (normalized.length < 10) {
            throw new errors_1.BadRequestError('Invalid phone number');
        }
        await models_1.Otp.update({ verified: true }, { where: { phone: normalized, verified: false } });
        const code = generateOtpCode();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await models_1.Otp.create({
            phone: normalized,
            code,
            expiresAt,
            verified: false,
        });
        console.log(`[OTP] Phone ${normalized} code: ${code}`);
        return {
            message: 'OTP sent successfully',
            debugCode: code,
            otp: code,
        };
    }
    async verifyOtp(phone, code, name) {
        const normalized = normalizePhone(phone);
        if (normalized.length < 10) {
            throw new errors_1.BadRequestError('Invalid phone number');
        }
        const otp = await models_1.Otp.findOne({
            where: {
                phone: normalized,
                code: String(code).trim(),
                verified: false,
                expiresAt: { [sequelize_1.Op.gt]: new Date() },
            },
            order: [['createdAt', 'DESC']],
        });
        if (!otp) {
            throw new errors_1.BadRequestError('Invalid or expired OTP');
        }
        otp.verified = true;
        await otp.save();
        // Same phone → same user (any device)
        let user = await models_1.User.findOne({
            where: {
                role: 'customer',
                [sequelize_1.Op.or]: [
                    { phone: normalized },
                    { phone: `91${normalized}` },
                    { phone: `+91${normalized}` },
                    { phone: { [sequelize_1.Op.like]: `%${normalized}` } },
                ],
            },
            order: [['createdAt', 'ASC']],
        });
        if (!user) {
            user = await models_1.User.create({
                name: (name && name.trim()) || `User ${normalized.slice(-4)}`,
                phone: normalized,
                email: null,
                password: null,
                role: 'customer',
                isActive: true,
            });
        }
        else {
            if (user.phone !== normalized) {
                user.phone = normalized;
            }
            const incoming = name?.trim();
            if (incoming &&
                incoming.length >= 2 &&
                (!user.name || /^User \d{4}$/.test(user.name))) {
                user.name = incoming;
            }
            await user.save();
        }
        if (!user.isActive) {
            throw new errors_1.BadRequestError('Account is deactivated');
        }
        const payload = {
            userId: user.id,
            role: user.role,
            phone: user.phone,
            email: user.email,
        };
        const accessToken = (0, tokens_1.signAccessToken)(payload);
        const refreshToken = (0, tokens_1.signRefreshToken)(payload);
        await models_1.RefreshToken.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
            },
        };
    }
}
exports.OtpService = OtpService;
exports.otpService = new OtpService();
//# sourceMappingURL=OtpService.js.map