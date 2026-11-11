import { Request } from 'express';

export type Role = 'admin' | 'staff' | 'customer';

export interface JwtPayload {
  userId: string;
  role: Role;
  email?: string | null;
  phone?: string | null;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  categoryId?: string;
}
