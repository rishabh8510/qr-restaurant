import { Router } from 'express';
import * as bannerController from '../controllers/banner.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();
router.use(authenticate);
router.get('/', bannerController.listBanners);
router.post('/', authorize('admin'), upload.single('image'), bannerController.createBanner);
router.put('/:id', authorize('admin'), upload.single('image'), bannerController.updateBanner);
router.delete('/:id', authorize('admin'), bannerController.deleteBanner);
export default router;
