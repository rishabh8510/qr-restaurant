import { DishOfTheDay } from '../models';
import { storageService } from '../services/StorageService';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
import { NotFoundError } from '../utils/errors';

const schema = z.object({
  name: z.string().min(1).max(150),
  price: z.number().min(0),
  productId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

function parseBody(body: Record<string, unknown>) {
  const b = { ...body };
  if (typeof b.price === 'string') b.price = parseFloat(b.price as string);
  if (typeof b.isActive === 'string') b.isActive = b.isActive === 'true';
  if (typeof b.sortOrder === 'string') b.sortOrder = parseInt(b.sortOrder as string, 10);
  if (b.productId === '') b.productId = null;
  return b;
}

export const listDishes = asyncHandler(async (req, res) => {
  const where: Record<string, unknown> = {};
  if (req.query.status === 'active') where.isActive = true;
  if (req.query.status === 'inactive') where.isActive = false;
  const rows = await DishOfTheDay.findAll({
    where,
    order: [
      ['sortOrder', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });
  res.json({ success: true, data: rows });
});

export const createDish = asyncHandler(async (req, res) => {
  const input = schema.parse(parseBody({ ...req.body }));
  if (!req.file) {
    res.status(400).json({ success: false, message: 'Image is required' });
    return;
  }
  const imageUrl = await storageService.upload(req.file, 'dish-of-the-day');
  const dish = await DishOfTheDay.create({
    name: input.name,
    price: input.price,
    image: imageUrl,
    productId: input.productId || null,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  });
  res.status(201).json({ success: true, data: dish });
});

export const updateDish = asyncHandler(async (req, res) => {
  const dish = await DishOfTheDay.findByPk(req.params.id);
  if (!dish) throw new NotFoundError('Dish not found');
  const input = schema.partial().parse(parseBody({ ...req.body }));
  if (input.name) dish.name = input.name;
  if (input.price !== undefined) dish.price = input.price;
  if (input.productId !== undefined) dish.productId = input.productId;
  if (input.sortOrder !== undefined) dish.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) dish.isActive = input.isActive;
  if (req.file) {
    if (dish.image) await storageService.delete(dish.image);
    dish.image = await storageService.upload(req.file, 'dish-of-the-day');
  }
  await dish.save();
  res.json({ success: true, data: dish });
});

export const deleteDish = asyncHandler(async (req, res) => {
  const dish = await DishOfTheDay.findByPk(req.params.id);
  if (!dish) throw new NotFoundError('Dish not found');
  if (dish.image) await storageService.delete(dish.image);
  await dish.destroy();
  res.json({ success: true, message: 'Dish deleted' });
});
