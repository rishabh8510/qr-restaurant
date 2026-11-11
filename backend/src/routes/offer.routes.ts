import { Router } from 'express';
import * as offerController from '../controllers/offer.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

router.get('/', offerController.listOffers);
router.get('/:id', offerController.getOffer);

router.post('/', authorize('admin'), upload.single('image'), offerController.createOffer);
router.put('/:id', authorize('admin'), upload.single('image'), offerController.updateOffer);
router.delete('/:id', authorize('admin'), offerController.deleteOffer);

export default router;
