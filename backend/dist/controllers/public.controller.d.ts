export declare const DEFAULT_WEBSITE_SETTINGS: {
    showBanner: boolean;
    showDishOfTheDay: boolean;
    showOffers: boolean;
    showSearch: boolean;
    showCategoryFilter: boolean;
    showSubCategoryFilter: boolean;
    filters: {
        veg: boolean;
        nonveg: boolean;
        vegan: boolean;
        egg: boolean;
        new: boolean;
        bestseller: boolean;
    };
    pricing: {
        taxPercent: number;
        firstOrderDiscountPercent: number;
        firstOrderDiscountEnabled: boolean;
        deliveryCharge: number;
        packingCharge: number;
    };
};
export declare function normalizeWebsiteSettings(raw: unknown): {
    filters: {
        veg: boolean;
        nonveg: boolean;
        vegan: boolean;
        egg: boolean;
        new: boolean;
        bestseller: boolean;
    };
    pricing: {
        taxPercent: number;
        firstOrderDiscountPercent: number;
        firstOrderDiscountEnabled: boolean;
        deliveryCharge: number;
        packingCharge: number;
    };
    showBanner: boolean;
    showDishOfTheDay: boolean;
    showOffers: boolean;
    showSearch: boolean;
    showCategoryFilter: boolean;
    showSubCategoryFilter: boolean;
};
export declare const getPublicMenu: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getPublicSettings: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getPublicBanners: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getPublicDishOfTheDay: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getPublicOffers: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const createPublicOrder: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getPublicOrder: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const likeProduct: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const quoteOrder: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=public.controller.d.ts.map