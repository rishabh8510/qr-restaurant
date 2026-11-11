import { Op } from 'sequelize';
import { Product, Category, SubCategory } from '../models';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';
import { NotFoundError } from '../utils/errors';
import { storageService } from './StorageService';

function normalizeTags(tags: unknown): string[] | null {
  if (tags == null) return null;
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      /* ignore */
    }
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return null;
}

export class ProductService {
  async list(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
    subCategoryId?: string;
    available?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.name = { [Op.iLike]: `%${query.search}%` };
    }
    if (query.status === 'active') where.isActive = true;
    if (query.status === 'inactive') where.isActive = false;
    if (query.available === 'true') where.isAvailable = true;
    if (query.available === 'false') where.isAvailable = false;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.subCategoryId) where.subCategoryId = query.subCategoryId;

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: SubCategory, as: 'subCategory', attributes: ['id', 'name', 'slug', 'categoryId'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async getById(id: string) {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: SubCategory, as: 'subCategory', attributes: ['id', 'name', 'slug', 'categoryId'] },
      ],
    });
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }

  async create(input: CreateProductInput, imageUrl?: string) {
    let categoryId = input.categoryId || null;
    let subCategoryId = input.subCategoryId || null;

    if (subCategoryId) {
      const sub = await SubCategory.findByPk(subCategoryId);
      if (!sub) throw new NotFoundError('Sub-category not found');
      categoryId = sub.categoryId;
    } else if (categoryId) {
      const cat = await Category.findByPk(categoryId);
      if (!cat) throw new NotFoundError('Category not found');
    }

    return Product.create({
      name: input.name,
      description: input.description || null,
      price: input.price,
      oldPrice: input.oldPrice ?? null,
      discount: input.discount || null,
      categoryId,
      subCategoryId,
      image: imageUrl || null,
      weight: input.weight || null,
      prepTime: input.prepTime || null,
      isVeg: input.isVeg ?? true,
      isEgg: input.isEgg ?? false,
      isVegan: input.isVegan ?? false,
      isAvailable: input.isAvailable ?? true,
      isActive: input.isActive ?? true,
      isNew: input.isNew ?? false,
      isBestseller: input.isBestseller ?? false,
      tags: normalizeTags(input.tags),
      rating: input.rating ?? 0,
      reviewCount: input.reviewCount ?? 0,
      orderCount: input.orderCount ?? 0,
      metadata: input.metadata || null,
    });
  }

  async update(id: string, input: UpdateProductInput, imageUrl?: string) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError('Product not found');

    if (input.subCategoryId !== undefined) {
      if (input.subCategoryId) {
        const sub = await SubCategory.findByPk(input.subCategoryId);
        if (!sub) throw new NotFoundError('Sub-category not found');
        product.subCategoryId = input.subCategoryId;
        product.categoryId = sub.categoryId;
      } else {
        product.subCategoryId = null;
      }
    }

    if (input.categoryId !== undefined && input.subCategoryId === undefined) {
      if (input.categoryId) {
        const cat = await Category.findByPk(input.categoryId);
        if (!cat) throw new NotFoundError('Category not found');
        product.categoryId = input.categoryId;
      } else {
        product.categoryId = null;
      }
    }

    if (input.name) product.name = input.name;
    if (input.description !== undefined) product.description = input.description;
    if (input.price !== undefined) product.price = input.price;
    if (input.oldPrice !== undefined) product.oldPrice = input.oldPrice;
    if (input.discount !== undefined) product.discount = input.discount;
    if (input.weight !== undefined) product.weight = input.weight;
    if (input.prepTime !== undefined) product.prepTime = input.prepTime;
    if (input.isVeg !== undefined) product.isVeg = input.isVeg;
    if (input.isEgg !== undefined) product.isEgg = input.isEgg;
    if (input.isVegan !== undefined) product.isVegan = input.isVegan;
    if (input.isAvailable !== undefined) product.isAvailable = input.isAvailable;
    if (input.isActive !== undefined) product.isActive = input.isActive;
    if (input.isNew !== undefined) product.isNew = input.isNew;
    if (input.isBestseller !== undefined) product.isBestseller = input.isBestseller;
    if (input.tags !== undefined) product.tags = normalizeTags(input.tags);
    if (input.rating !== undefined) product.rating = input.rating;
    if (input.reviewCount !== undefined) product.reviewCount = input.reviewCount;
    if (input.orderCount !== undefined) product.orderCount = input.orderCount;
    if (input.metadata !== undefined) product.metadata = input.metadata;
    if (imageUrl) {
      if (product.image) await storageService.delete(product.image);
      product.image = imageUrl;
    }

    await product.save();
    return this.getById(id);
  }

  async delete(id: string) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError('Product not found');
    if (product.image) await storageService.delete(product.image);
    await product.destroy();
  }
}

export const productService = new ProductService();
