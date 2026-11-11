import { SubCategory } from '../models';
import { CreateSubCategoryInput, UpdateSubCategoryInput } from '../validators/subCategory.validator';
export declare class SubCategoryService {
    list(query: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        categoryId?: string;
    }): Promise<{
        data: SubCategory[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<SubCategory>;
    create(input: CreateSubCategoryInput, imageUrl?: string): Promise<SubCategory>;
    update(id: string, input: UpdateSubCategoryInput, imageUrl?: string): Promise<SubCategory>;
    delete(id: string): Promise<void>;
}
export declare const subCategoryService: SubCategoryService;
//# sourceMappingURL=SubCategoryService.d.ts.map