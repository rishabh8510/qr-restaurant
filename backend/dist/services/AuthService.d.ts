import { User } from '../models';
export declare class AuthService {
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            role: import("../types").Role;
            isActive: true;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            role: import("../types").Role;
            isActive: true;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken?: string): Promise<void>;
    getMe(userId: string): Promise<User>;
}
export declare const authService: AuthService;
//# sourceMappingURL=AuthService.d.ts.map