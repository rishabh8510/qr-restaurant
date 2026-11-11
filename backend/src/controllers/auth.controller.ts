import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { authService } from '../services/AuthService';
import { loginSchema } from '../validators/auth.validator';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';

const cookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none',
  domain: env.COOKIE_DOMAIN === 'localhost' ? undefined : env.COOKIE_DOMAIN,
  path: '/',
};

export const login = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input.email, input.password);

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



export const refresh = asyncHandler(async (req, res) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!refreshToken) {
    res.status(401).json({ success: false, message: 'No refresh token' });
    return;
  }

  const result = await authService.refresh(refreshToken);

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



export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logout(refreshToken);

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  res.json({ success: true, message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req: AuthRequest, res) => {
  const user = await authService.getMe(req.user!.userId);
  res.json({ success: true, data: user });
});

import { otpService } from '../services/OtpService';
import { z } from 'zod';

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(20),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().length(6),
  name: z.string().max(100).optional(),
});

export const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = sendOtpSchema.parse(req.body);
  const result = await otpService.sendOtp(phone);
  res.json({ success: true, ...result });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const input = verifyOtpSchema.parse(req.body);
  const result = await otpService.verifyOtp(input.phone, input.code, input.name);

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
export const wsToken = asyncHandler(async (req: AuthRequest, res) => {
  const user = req.user!;
  const { signAccessToken } = await import('../utils/tokens');
  const token = signAccessToken({
    userId: user.userId,
    role: user.role,
    email: user.email,
    phone: user.phone,
  });
  res.json({ success: true, data: { token } });
});
