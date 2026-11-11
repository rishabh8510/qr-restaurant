import api from '@/api/client';
import {
  User,
  Category,
  SubCategory,
  Product,
  Offer,
  Restaurant,
  DashboardStats,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

// Staff
export const staffApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<User>>('/staff', { params }).then((r) => r.data),
  get: (id: string) => api.get<ApiResponse<User>>(`/staff/${id}`).then((r) => r.data),
  create: (data: FormData | object) => api.post<ApiResponse<User>>('/staff', data).then((r) => r.data),
  update: (id: string, data: object) => api.put<ApiResponse<User>>(`/staff/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/staff/${id}`).then((r) => r.data),
  toggleStatus: (id: string) => api.patch(`/staff/${id}/toggle-status`).then((r) => r.data),
};

// Categories
export const categoryApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Category>>('/categories', { params }).then((r) => r.data),
  get: (id: string) => api.get<ApiResponse<Category>>(`/categories/${id}`).then((r) => r.data),
  create: (data: FormData) =>
    api.post<ApiResponse<Category>>('/categories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  delete: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
};

// Sub-Categories
export const subCategoryApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<SubCategory>>('/sub-categories', { params }).then((r) => r.data),
  get: (id: string) => api.get<ApiResponse<SubCategory>>(`/sub-categories/${id}`).then((r) => r.data),
  create: (data: FormData) =>
    api.post<ApiResponse<SubCategory>>('/sub-categories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<SubCategory>>(`/sub-categories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  delete: (id: string) => api.delete(`/sub-categories/${id}`).then((r) => r.data),
};

// Products
export const productApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Product>>('/products', { params }).then((r) => r.data),
  get: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`).then((r) => r.data),
  create: (data: FormData) =>
    api.post<ApiResponse<Product>>('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  delete: (id: string) => api.delete(`/products/${id}`).then((r) => r.data),
};

// Offers
export const offerApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Offer>>('/offers', { params }).then((r) => r.data),
  get: (id: string) => api.get<ApiResponse<Offer>>(`/offers/${id}`).then((r) => r.data),
  create: (data: FormData) =>
    api.post<ApiResponse<Offer>>('/offers', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Offer>>(`/offers/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  delete: (id: string) => api.delete(`/offers/${id}`).then((r) => r.data),
};

// Restaurant
export const restaurantApi = {
  get: () => api.get<ApiResponse<Restaurant>>('/restaurant').then((r) => r.data),
  update: (data: FormData) =>
    api.put<ApiResponse<Restaurant>>('/restaurant', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
};

// Dashboard
export const dashboardApi = {
  stats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats').then((r) => r.data),
};
