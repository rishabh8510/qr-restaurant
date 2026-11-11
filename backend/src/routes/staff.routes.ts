import { Router } from 'express';
import * as staffController from '../controllers/staff.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', staffController.listStaff);
router.get('/:id', staffController.getStaff);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);
router.patch('/:id/toggle-status', staffController.toggleStaffStatus);

export default router;
