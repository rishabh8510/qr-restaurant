export declare class OtpService {
    sendOtp(phone: string): Promise<{
        message: string;
        debugCode?: string;
        otp?: string;
    }>;
    verifyOtp(phone: string, code: string, name?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
            role: import("../types").Role;
        };
    }>;
}
export declare const otpService: OtpService;
//# sourceMappingURL=OtpService.d.ts.map