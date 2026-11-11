import { Router } from 'express';
import * as restaurantController from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

router.get('/', restaurantController.getRestaurant);
router.put(
  '/',
  authorize('admin'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  restaurantController.updateRestaurant
);

export default router;
