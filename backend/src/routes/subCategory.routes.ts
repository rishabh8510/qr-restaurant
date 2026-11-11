import { Router } from 'express';
import * as subCategoryController from '../controllers/subCategory.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

// Both admin and staff can view
router.get('/', subCategoryController.listSubCategories);
router.get('/:id', subCategoryController.getSubCategory);

// Admin only for mutations
router.post('/', authorize('admin'), upload.single('image'), subCategoryController.createSubCategory);
router.put('/:id', authorize('admin'), upload.single('image'), subCategoryController.updateSubCategory);
router.delete('/:id', authorize('admin'), subCategoryController.deleteSubCategory);

export default router;
