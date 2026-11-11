import { Category } from '../models';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';
export declare class CategoryService {
    list(query: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<{
        data: Category[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<Category>;
    create(input: CreateCategoryInput, imageUrl?: string): Promise<Category>;
    update(id: string, input: UpdateCategoryInput, imageUrl?: string): Promise<Category>;
    delete(id: string): Promise<void>;
}
export declare const categoryService: CategoryService;
//# sourceMappingURL=CategoryService.d.ts.map