// import { offerService } from '../services/OfferService';
// import { createOfferSchema, updateOfferSchema } from '../validators/offer.validator';
// import { storageService } from '../services/StorageService';
// import { asyncHandler } from '../utils/asyncHandler';

// export const listOffers = asyncHandler(async (req, res) => {
//   const result = await offerService.list({
//     page: req.query.page ? parseInt(req.query.page as string) : 1,
//     limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
//     search: req.query.search as string,
//     status: req.query.status as string,
//     activeOnly: req.query.activeOnly === 'true',
//   });
//   res.json({ success: true, ...result });
// });

// export const getOffer = asyncHandler(async (req, res) => {
//   const offer = await offerService.getById(req.params.id);
//   res.json({ success: true, data: offer });
// });

// export const createOffer = asyncHandler(async (req, res) => {
//   const body = { ...req.body };
//   if (typeof body.discountValue === 'string') body.discountValue = parseFloat(body.discountValue);
//   if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
//   if (typeof body.productIds === 'string') {
//     try { body.productIds = JSON.parse(body.productIds); } catch { body.productIds = []; }
//   }
//   if (typeof body.categoryIds === 'string') {
//     try { body.categoryIds = JSON.parse(body.categoryIds); } catch { body.categoryIds = []; }
//   }
//   const input = createOfferSchema.parse(body);
//   let imageUrl: string | undefined;
//   if (req.file) {
//     imageUrl = await storageService.upload(req.file, 'offers');
//   }
//   const offer = await offerService.create(input, imageUrl);
//   res.status(201).json({ success: true, data: offer });
// });

// export const updateOffer = asyncHandler(async (req, res) => {
//   const body = { ...req.body };
//   if (typeof body.discountValue === 'string') body.discountValue = parseFloat(body.discountValue);
//   if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
//   if (typeof body.productIds === 'string') {
//     try { body.productIds = JSON.parse(body.productIds); } catch { body.productIds = []; }
//   }
//   if (typeof body.categoryIds === 'string') {
//     try { body.categoryIds = JSON.parse(body.categoryIds); } catch { body.categoryIds = []; }
//   }
//   const input = updateOfferSchema.parse(body);
//   let imageUrl: string | undefined;
//   if (req.file) {
//     imageUrl = await storageService.upload(req.file, 'offers');
//   }
//   const offer = await offerService.update(req.params.id, input, imageUrl);
//   res.json({ success: true, data: offer });
// });

// export const deleteOffer = asyncHandler(async (req, res) => {
//   await offerService.delete(req.params.id);
//   res.json({ success: true, message: 'Offer deleted successfully' });
// });




import { offerService } from '../services/OfferService';
import { createOfferSchema, updateOfferSchema } from '../validators/offer.validator';
import { storageService } from '../services/StorageService';
import { asyncHandler } from '../utils/asyncHandler';

function normalizeBody(raw: Record<string, unknown>) {
  const body = { ...raw };
  if (typeof body.discountValue === 'string') body.discountValue = parseFloat(body.discountValue);
  if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
  if (typeof body.minOrderCount === 'string') {
    body.minOrderCount = body.minOrderCount ? parseInt(body.minOrderCount, 10) : null;
  }
  if (typeof body.productIds === 'string') {
    try {
      body.productIds = JSON.parse(body.productIds as string);
    } catch {
      body.productIds = [];
    }
  }
  if (typeof body.categoryIds === 'string') {
    try {
      body.categoryIds = JSON.parse(body.categoryIds as string);
    } catch {
      body.categoryIds = [];
    }
  }
  return body;
}

export const listOffers = asyncHandler(async (req, res) => {
  const result = await offerService.list({
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    search: req.query.search as string,
    status: req.query.status as string,
    activeOnly: req.query.activeOnly === 'true',
  });
  res.json({ success: true, ...result });
});

export const getOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.getById(req.params.id);
  res.json({ success: true, data: offer });
});

export const createOffer = asyncHandler(async (req, res) => {
  const body = normalizeBody({ ...req.body });
  const input = createOfferSchema.parse(body);
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await storageService.upload(req.file, 'offers');
  }
  const offer = await offerService.create(input, imageUrl);
  res.status(201).json({ success: true, data: offer });
});

export const updateOffer = asyncHandler(async (req, res) => {
  const body = normalizeBody({ ...req.body });
  const input = updateOfferSchema.parse(body);
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await storageService.upload(req.file, 'offers');
  }
  const offer = await offerService.update(req.params.id, input, imageUrl);
  res.json({ success: true, data: offer });
});

export const deleteOffer = asyncHandler(async (req, res) => {
  await offerService.delete(req.params.id);
  res.json({ success: true, message: 'Offer deleted successfully' });
});