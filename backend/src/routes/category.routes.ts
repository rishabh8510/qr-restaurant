import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

// Both admin and staff can view
router.get('/', categoryController.listCategories);
router.get('/:id', categoryController.getCategory);

// Admin only for mutations
router.post('/', authorize('admin'), upload.single('image'), categoryController.createCategory);
router.put('/:id', authorize('admin'), upload.single('image'), categoryController.updateCategory);
router.delete('/:id', authorize('admin'), categoryController.deleteCategory);

export default router;
