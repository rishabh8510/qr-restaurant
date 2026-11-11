import argon2 from 'argon2';
import { Op } from 'sequelize';
import { User } from '../models';
import { CreateStaffInput, UpdateStaffInput } from '../validators/staff.validator';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors';

export class StaffService {
  async list(query: { page?: number; limit?: number; search?: string; status?: string }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = { role: 'staff' };
    if (query.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { email: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    if (query.status === 'active') where.isActive = true;
    if (query.status === 'inactive') where.isActive = false;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getById(id: string) {
    const staff = await User.findOne({
      where: { id, role: 'staff' },
      attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
    if (!staff) throw new NotFoundError('Staff not found');
    return staff;
  }

  async create(input: CreateStaffInput) {
    const existing = await User.findOne({ where: { email: input.email.toLowerCase() } });
    if (existing) throw new ConflictError('Email already in use');

    const hashed = await argon2.hash(input.password);

    const staff = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone || null,
      password: hashed,
      role: 'staff',
      isActive: true,
    });

    return {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      isActive: staff.isActive,
      createdAt: staff.createdAt,
    };
  }

  async update(id: string, input: UpdateStaffInput) {
    const staff = await User.findOne({ where: { id, role: 'staff' } });
    if (!staff) throw new NotFoundError('Staff not found');

    if (input.email && input.email.toLowerCase() !== staff.email) {
      const existing = await User.findOne({ where: { email: input.email.toLowerCase() } });
      if (existing) throw new ConflictError('Email already in use');
      staff.email = input.email.toLowerCase();
    }

    if (input.name) staff.name = input.name;
    if (input.phone !== undefined) staff.phone = input.phone;
    if (input.isActive !== undefined) staff.isActive = input.isActive;
    if (input.password) {
      staff.password = await argon2.hash(input.password);
    }

    await staff.save();

    return {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      isActive: staff.isActive,
      updatedAt: staff.updatedAt,
    };
  }

  async delete(id: string) {
    const staff = await User.findOne({ where: { id, role: 'staff' } });
    if (!staff) throw new NotFoundError('Staff not found');
    await staff.destroy();
  }

  async toggleStatus(id: string) {
    const staff = await User.findOne({ where: { id, role: 'staff' } });
    if (!staff) throw new NotFoundError('Staff not found');
    staff.isActive = !staff.isActive;
    await staff.save();
    return {
      id: staff.id,
      isActive: staff.isActive,
    };
  }
}

export const staffService = new StaffService();
