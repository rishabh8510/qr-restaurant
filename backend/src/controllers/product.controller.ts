import { productService } from '../services/ProductService';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';
import { storageService } from '../services/StorageService';
import { asyncHandler } from '../utils/asyncHandler';

function parseBody(body: Record<string, unknown>) {
  const b = { ...body };
  if (typeof b.price === 'string') b.price = parseFloat(b.price as string);
  if (typeof b.oldPrice === 'string') {
    b.oldPrice = b.oldPrice === '' ? null : parseFloat(b.oldPrice as string);
  }
  if (typeof b.rating === 'string') {
    b.rating = b.rating === '' ? null : parseFloat(b.rating as string);
  }
  if (typeof b.reviewCount === 'string') b.reviewCount = parseInt(b.reviewCount as string, 10) || 0;
  if (typeof b.orderCount === 'string') b.orderCount = parseInt(b.orderCount as string, 10) || 0;
  const boolFields = [
    'isVeg',
    'isEgg',
    'isVegan',
    'isAvailable',
    'isActive',
    'isNew',
    'isBestseller',
  ];
  for (const f of boolFields) {
    if (typeof b[f] === 'string') b[f] = b[f] === 'true';
  }
  return b;
}

export const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.list({
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    search: req.query.search as string,
    status: req.query.status as string,
    categoryId: req.query.categoryId as string,
    subCategoryId: req.query.subCategoryId as string,
    available: req.query.available as string,
  });
  res.json({ success: true, ...result });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const body = parseBody({ ...req.body });
  const input = createProductSchema.parse(body);
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await storageService.upload(req.file, 'products');
  }
  const product = await productService.create(input, imageUrl);
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const body = parseBody({ ...req.body });
  const input = updateProductSchema.parse(body);
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await storageService.upload(req.file, 'products');
  }
  const product = await productService.update(req.params.id, input, imageUrl);
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.delete(req.params.id);
  res.json({ success: true, message: 'Product deleted successfully' });
});
