import { Model, Optional } from 'sequelize';
interface RefreshTokenAttributes {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id' | 'isRevoked' | 'createdAt' | 'updatedAt'> {
}
export declare class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export {};
//# sourceMappingURL=RefreshToken.d.ts.map