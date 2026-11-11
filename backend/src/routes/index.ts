import { Router } from 'express';
import authRoutes from './auth.routes';
import staffRoutes from './staff.routes';
import categoryRoutes from './category.routes';
import subCategoryRoutes from './subCategory.routes';
import productRoutes from './product.routes';
import offerRoutes from './offer.routes';
import restaurantRoutes from './restaurant.routes';
import dashboardRoutes from './dashboard.routes';
import publicRoutes from './public.routes';
import bannerRoutes from './banner.routes';
import dishOfTheDayRoutes from './dishOfTheDay.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/staff', staffRoutes);
router.use('/categories', categoryRoutes);
router.use('/sub-categories', subCategoryRoutes);
router.use('/products', productRoutes);
router.use('/offers', offerRoutes);
router.use('/restaurant', restaurantRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/public', publicRoutes);
router.use('/banners', bannerRoutes);
router.use('/dish-of-the-day', dishOfTheDayRoutes);
router.use('/orders', orderRoutes);

export default router;
