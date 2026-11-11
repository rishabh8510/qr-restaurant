import { Model, Optional } from 'sequelize';
import { Role } from '../types';
interface UserAttributes {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    password: string | null;
    role: Role;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'email' | 'phone' | 'password' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    password: string | null;
    role: Role;
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
export {};
//# sourceMappingURL=User.d.ts.map