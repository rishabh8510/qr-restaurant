import { Offer } from '../models';
import { CreateOfferInput, UpdateOfferInput } from '../validators/offer.validator';
export declare class OfferService {
    list(query: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        activeOnly?: boolean;
    }): Promise<{
        data: Offer[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<Offer>;
    create(input: CreateOfferInput, imageUrl?: string): Promise<Offer>;
    update(id: string, input: UpdateOfferInput, imageUrl?: string): Promise<Offer>;
    delete(id: string): Promise<void>;
}
export declare const offerService: OfferService;
//# sourceMappingURL=OfferService.d.ts.map