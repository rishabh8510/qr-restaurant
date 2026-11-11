export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  staff: {
    all: ['staff'] as const,
    list: (params?: Record<string, string | number>) => ['staff', 'list', params] as const,
    detail: (id: string) => ['staff', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (params?: Record<string, string | number>) => ['categories', 'list', params] as const,
    detail: (id: string) => ['categories', id] as const,
  },
  subCategories: {
    all: ['subCategories'] as const,
    list: (params?: Record<string, string | number>) => ['subCategories', 'list', params] as const,
    detail: (id: string) => ['subCategories', id] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params?: Record<string, string | number>) => ['products', 'list', params] as const,
    detail: (id: string) => ['products', id] as const,
  },
  offers: {
    all: ['offers'] as const,
    list: (params?: Record<string, string | number>) => ['offers', 'list', params] as const,
    detail: (id: string) => ['offers', id] as const,
  },
  restaurant: {
    all: ['restaurant'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
};
