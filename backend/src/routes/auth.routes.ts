import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);
router.get('/ws-token', authenticate, authController.wsToken);

// Customer mobile OTP
router.post('/otp/send', authLimiter, authController.sendOtp);
router.post('/otp/verify', authLimiter, authController.verifyOtp);

export default router;
