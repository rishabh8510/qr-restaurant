import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Customer own orders (must be before /:id)
router.get(
  '/me/list',
  authenticate,
  authorize('customer'),
  orderController.myOrders
);

// Staff + Admin list
router.get(
  '/',
  authenticate,
  authorize('admin', 'staff'),
  orderController.listOrders
);

router.post(
  '/manual',
  authenticate,
  authorize('admin', 'staff'),
  orderController.createManualOrder
);

router.get(
  '/:id',
  authenticate,
  authorize('admin', 'staff', 'customer'),
  orderController.getOrder
);

router.post(
  '/:id/accept',
  authenticate,
  authorize('admin', 'staff'),
  orderController.acceptOrder
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('admin', 'staff'),
  orderController.updateOrderStatus
);

export default router;
