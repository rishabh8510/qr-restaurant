import { Product } from '../models';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';
export declare class ProductService {
    list(query: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        categoryId?: string;
        subCategoryId?: string;
        available?: string;
    }): Promise<{
        data: Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<Product>;
    create(input: CreateProductInput, imageUrl?: string): Promise<Product>;
    update(id: string, input: UpdateProductInput, imageUrl?: string): Promise<Product>;
    delete(id: string): Promise<void>;
}
export declare const productService: ProductService;
//# sourceMappingURL=ProductService.d.ts.map