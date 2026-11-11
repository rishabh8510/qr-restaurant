import { Router } from 'express';
import * as dishController from '../controllers/dishOfTheDay.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();
router.use(authenticate);
router.get('/', dishController.listDishes);
router.post('/', authorize('admin'), upload.single('image'), dishController.createDish);
router.put('/:id', authorize('admin'), upload.single('image'), dishController.updateDish);
router.delete('/:id', authorize('admin'), dishController.deleteDish);
export default router;
