import argon2 from 'argon2';
import { User, RefreshToken } from '../models';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens';
import { UnauthorizedError, NotFoundError } from '../utils/errors';
import { JwtPayload } from '../types';
import { env } from '../config/env';
import { Op } from 'sequelize';

export class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !user.isActive || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store refresh token
    const expiresAt = new Date();
    const days = parseInt(env.REFRESH_TOKEN_EXPIRES_IN) || 7;
    expiresAt.setDate(expiresAt.getDate() + days);

    await RefreshToken.create({
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

  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const stored = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        userId: payload.userId,
        isRevoked: false,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!stored) {
      throw new UnauthorizedError('Refresh token revoked or expired');
    }

    const user = await User.findByPk(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Revoke old token (rotation)
    stored.isRevoked = true;
    await stored.save();

    const newPayload: JwtPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };

    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    const expiresAt = new Date();
    const days = parseInt(env.REFRESH_TOKEN_EXPIRES_IN) || 7;
    expiresAt.setDate(expiresAt.getDate() + days);

    await RefreshToken.create({
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

  async logout(refreshToken?: string) {
    if (refreshToken) {
      await RefreshToken.update(
        { isRevoked: true },
        { where: { token: refreshToken } }
      );
    }
  }

  async getMe(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt'],
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}

export const authService = new AuthService();
