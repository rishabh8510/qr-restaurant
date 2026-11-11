import { Model, Optional } from 'sequelize';
interface OtpAttributes {
    id: string;
    phone: string;
    code: string;
    expiresAt: Date;
    verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
interface OtpCreationAttributes extends Optional<OtpAttributes, 'id' | 'verified' | 'createdAt' | 'updatedAt'> {
}
export declare class Otp extends Model<OtpAttributes, OtpCreationAttributes> implements OtpAttributes {
    id: string;
    phone: string;
    code: string;
    expiresAt: Date;
    verified: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export {};
//# sourceMappingURL=Otp.d.ts.map