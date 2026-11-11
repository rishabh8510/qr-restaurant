import { Router } from 'express';
import * as publicController from '../controllers/public.controller';
import { optionalAuth } from '../middlewares/auth';

const router = Router();

router.get('/menu', publicController.getPublicMenu);
router.get('/banners', publicController.getPublicBanners);
router.get('/dish-of-the-day', publicController.getPublicDishOfTheDay);
router.get('/offers', publicController.getPublicOffers);
router.get('/settings', publicController.getPublicSettings);
router.post('/orders', optionalAuth, publicController.createPublicOrder);
router.post('/products/:id/like', optionalAuth, publicController.likeProduct);
router.post('/orders/quote', optionalAuth, publicController.quoteOrder);
router.get('/orders/:id', publicController.getPublicOrder);

export default router;
