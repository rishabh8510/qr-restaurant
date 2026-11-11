import { Op } from 'sequelize';
import { SubCategory, Category } from '../models';
import { CreateSubCategoryInput, UpdateSubCategoryInput } from '../validators/subCategory.validator';
import { NotFoundError, ConflictError } from '../utils/errors';
import { storageService } from './StorageService';
import { slugify } from '../utils/slug';

export class SubCategoryService {
  async list(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 50, 100);
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.name = { [Op.iLike]: `%${query.search}%` };
    }
    if (query.status === 'active') where.isActive = true;
    if (query.status === 'inactive') where.isActive = false;
    if (query.categoryId) where.categoryId = query.categoryId;

    const { rows, count } = await SubCategory.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
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
    const subCategory = await SubCategory.findByPk(id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    if (!subCategory) throw new NotFoundError('Sub-category not found');
    return subCategory;
  }

  async create(input: CreateSubCategoryInput, imageUrl?: string) {
    const category = await Category.findByPk(input.categoryId);
    if (!category) throw new NotFoundError('Category not found');

    const existing = await SubCategory.findOne({
      where: { name: input.name, categoryId: input.categoryId },
    });
    if (existing) throw new ConflictError('Sub-category name already exists in this category');

    const slug = input.slug?.trim() || slugify(input.name);

    return SubCategory.create({
      name: input.name,
      slug,
      description: input.description || null,
      image: imageUrl || null,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
      categoryId: input.categoryId,
    });
  }

  async update(id: string, input: UpdateSubCategoryInput, imageUrl?: string) {
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) throw new NotFoundError('Sub-category not found');

    if (input.categoryId && input.categoryId !== subCategory.categoryId) {
      const category = await Category.findByPk(input.categoryId);
      if (!category) throw new NotFoundError('Category not found');
      subCategory.categoryId = input.categoryId;
    }

    if (input.name && input.name !== subCategory.name) {
      const catId = input.categoryId || subCategory.categoryId;
      const existing = await SubCategory.findOne({
        where: { name: input.name, categoryId: catId },
      });
      if (existing) throw new ConflictError('Sub-category name already exists in this category');
      subCategory.name = input.name;
      if (!input.slug) subCategory.slug = slugify(input.name);
    }

    if (input.slug !== undefined) subCategory.slug = input.slug || slugify(subCategory.name);
    if (input.description !== undefined) subCategory.description = input.description;
    if (input.isActive !== undefined) subCategory.isActive = input.isActive;
    if (input.sortOrder !== undefined) subCategory.sortOrder = input.sortOrder;
    if (imageUrl) {
      if (subCategory.image) await storageService.delete(subCategory.image);
      subCategory.image = imageUrl;
    }

    await subCategory.save();
    return this.getById(id);
  }

  async delete(id: string) {
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) throw new NotFoundError('Sub-category not found');
    if (subCategory.image) await storageService.delete(subCategory.image);
    await subCategory.destroy();
  }
}

export const subCategoryService = new SubCategoryService();
