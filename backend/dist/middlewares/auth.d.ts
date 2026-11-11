import { Response, NextFunction } from 'express';
import { AuthRequest, Role } from '../types';
export declare function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void;
/** Optional auth – attaches user if token present, otherwise continues */
export declare function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void;
export declare function authorize(...roles: Role[]): (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map