import { categoryService } from '../services/CategoryService';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';
import { storageService } from '../services/StorageService';
import { asyncHandler } from '../utils/asyncHandler';

export const listCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.list({
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
    search: req.query.search as string,
    status: req.query.status as string,
  });
  res.json({ success: true, ...result });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  res.json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
  if (typeof body.sortOrder === 'string') body.sortOrder = parseInt(body.sortOrder, 10);
  const input = createCategorySchema.parse(body);
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await storageService.upload(req.file, 'categories');
  }
  const category = await categoryService.create(input, imageUrl);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
  if (typeof body.sortOrder === 'string') body.sortOrder = parseInt(body.sortOrder, 10);
  const input = updateCategorySchema.parse(body);
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await storageService.upload(req.file, 'categories');
  }
  const category = await categoryService.update(req.params.id, input, imageUrl);
  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.delete(req.params.id);
  res.json({ success: true, message: 'Category deleted successfully' });
});
