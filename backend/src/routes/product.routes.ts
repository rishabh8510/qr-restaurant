import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

router.post('/', authorize('admin'), upload.single('image'), productController.createProduct);
router.put('/:id', authorize('admin'), upload.single('image'), productController.updateProduct);
router.delete('/:id', authorize('admin'), productController.deleteProduct);

export default router;
