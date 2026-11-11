import { Op } from 'sequelize';
import { Category } from '../models';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';
import { NotFoundError, ConflictError } from '../utils/errors';
import { storageService } from './StorageService';
import { slugify } from '../utils/slug';

export class CategoryService {
  async list(query: { page?: number; limit?: number; search?: string; status?: string }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 50, 100);
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.name = { [Op.iLike]: `%${query.search}%` };
    }
    if (query.status === 'active') where.isActive = true;
    if (query.status === 'inactive') where.isActive = false;

    const { rows, count } = await Category.findAndCountAll({
      where,
      order: [
        ['sortOrder', 'ASC'],
        ['name', 'ASC'],
      ],
      limit,
      offset,
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async getById(id: string) {
    const category = await Category.findByPk(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }

  async create(input: CreateCategoryInput, imageUrl?: string) {
    const existing = await Category.findOne({ where: { name: input.name } });
    if (existing) throw new ConflictError('Category name already exists');

    const slug = input.slug?.trim() || slugify(input.name);

    return Category.create({
      name: input.name,
      slug,
      description: input.description || null,
      image: imageUrl || null,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    });
  }

  async update(id: string, input: UpdateCategoryInput, imageUrl?: string) {
    const category = await Category.findByPk(id);
    if (!category) throw new NotFoundError('Category not found');

    if (input.name && input.name !== category.name) {
      const existing = await Category.findOne({ where: { name: input.name } });
      if (existing) throw new ConflictError('Category name already exists');
      category.name = input.name;
      if (!input.slug) category.slug = slugify(input.name);
    }

    if (input.slug !== undefined) category.slug = input.slug || slugify(category.name);
    if (input.description !== undefined) category.description = input.description;
    if (input.isActive !== undefined) category.isActive = input.isActive;
    if (input.sortOrder !== undefined) category.sortOrder = input.sortOrder;
    if (imageUrl) {
      if (category.image) await storageService.delete(category.image);
      category.image = imageUrl;
    }

    await category.save();
    return category;
  }

  async delete(id: string) {
    const category = await Category.findByPk(id);
    if (!category) throw new NotFoundError('Category not found');
    if (category.image) await storageService.delete(category.image);
    await category.destroy();
  }
}

export const categoryService = new CategoryService();
