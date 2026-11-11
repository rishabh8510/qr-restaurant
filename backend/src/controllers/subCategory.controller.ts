import { subCategoryService } from '../services/SubCategoryService';
import { createSubCategorySchema, updateSubCategorySchema } from '../validators/subCategory.validator';
import { storageService } from '../services/StorageService';
import { asyncHandler } from '../utils/asyncHandler';

export const listSubCategories = asyncHandler(async (req, res) => {
  const result = await subCategoryService.list({
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
    search: req.query.search as string,
    status: req.query.status as string,
    categoryId: req.query.categoryId as string,
  });
  res.json({ success: true, ...result });
});

export const getSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await subCategoryService.getById(req.params.id);
  res.json({ success: true, data: subCategory });
});

export const createSubCategory = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
  if (typeof body.sortOrder === 'string') body.sortOrder = parseInt(body.sortOrder, 10);
  const input = createSubCategorySchema.parse(body);
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await storageService.upload(req.file, 'sub-categories');
  }
  const subCategory = await subCategoryService.create(input, imageUrl);
  res.status(201).json({ success: true, data: subCategory });
});

export const updateSubCategory = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
  if (typeof body.sortOrder === 'string') body.sortOrder = parseInt(body.sortOrder, 10);
  const input = updateSubCategorySchema.parse(body);
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await storageService.upload(req.file, 'sub-categories');
  }
  const subCategory = await subCategoryService.update(req.params.id, input, imageUrl);
  res.json({ success: true, data: subCategory });
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  await subCategoryService.delete(req.params.id);
  res.json({ success: true, message: 'Sub-category deleted successfully' });
});
