import { Response, NextFunction } from 'express';
import { AuthRequest, Role, JwtPayload } from '../types';
import { verifyAccessToken } from '../utils/tokens';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    let token = req.cookies?.accessToken;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }
    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }
    const payload = verifyAccessToken(token) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired access token'));
  }
}

/** Optional auth – attaches user if token present, otherwise continues */
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    let token = req.cookies?.accessToken;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }
    if (token) {
      const payload = verifyAccessToken(token) as JwtPayload;
      req.user = payload;
    }
  } catch {
    // ignore invalid token for optional
  }
  next();
}

export function authorize(...roles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
}
