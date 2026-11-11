import { User } from '../models';
import { CreateStaffInput, UpdateStaffInput } from '../validators/staff.validator';
export declare class StaffService {
    list(query: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<{
        data: User[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<User>;
    create(input: CreateStaffInput): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: import("../types").Role;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, input: UpdateStaffInput): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: import("../types").Role;
        isActive: boolean;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<void>;
    toggleStatus(id: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
}
export declare const staffService: StaffService;
//# sourceMappingURL=StaffService.d.ts.map