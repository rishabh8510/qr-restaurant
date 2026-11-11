import { restaurantService } from '../services/RestaurantService';
import { updateRestaurantSchema } from '../validators/restaurant.validator';
import { storageService } from '../services/StorageService';
import { asyncHandler } from '../utils/asyncHandler';

export const getRestaurant = asyncHandler(async (_req, res) => {
  const restaurant = await restaurantService.get();
  res.json({ success: true, data: restaurant });
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  // FormData may send settings as JSON string
  if (typeof body.settings === 'string') {
    try {
      body.settings = JSON.parse(body.settings);
    } catch {
      body.settings = undefined;
    }
  }
  const input = updateRestaurantSchema.parse(body);
  let logoUrl: string | undefined;
  let coverUrl: string | undefined;

  // Handle multiple files if using fields
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (files?.logo?.[0]) {
    logoUrl = await storageService.upload(files.logo[0], 'restaurant');
  }
  if (files?.coverImage?.[0]) {
    coverUrl = await storageService.upload(files.coverImage[0], 'restaurant');
  }
  // Single file fallback
  if (req.file) {
    logoUrl = await storageService.upload(req.file, 'restaurant');
  }

  const restaurant = await restaurantService.update(input, logoUrl, coverUrl);
  res.json({ success: true, data: restaurant });
});
