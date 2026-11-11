import { Banner } from '../models';
import { storageService } from '../services/StorageService';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
import { NotFoundError } from '../utils/errors';

const schema = z.object({
  title: z.string().max(150).optional().nullable(),
  link: z.string().max(500).optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const listBanners = asyncHandler(async (req, res) => {
  const where: Record<string, unknown> = {};
  if (req.query.status === 'active') where.isActive = true;
  if (req.query.status === 'inactive') where.isActive = false;
  const rows = await Banner.findAll({
    where,
    order: [
      ['sortOrder', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });
  res.json({ success: true, data: rows });
});

export const createBanner = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
  if (typeof body.sortOrder === 'string') body.sortOrder = parseInt(body.sortOrder, 10);
  const input = schema.parse(body);
  if (!req.file) {
    res.status(400).json({ success: false, message: 'Image is required' });
    return;
  }
  const imageUrl = await storageService.upload(req.file, 'banners');
  const banner = await Banner.create({
    image: imageUrl,
    title: input.title || null,
    link: input.link || null,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  });
  res.status(201).json({ success: true, data: banner });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);
  if (!banner) throw new NotFoundError('Banner not found');
  const body = { ...req.body };
  if (typeof body.isActive === 'string') body.isActive = body.isActive === 'true';
  if (typeof body.sortOrder === 'string') body.sortOrder = parseInt(body.sortOrder, 10);
  const input = schema.partial().parse(body);
  if (input.title !== undefined) banner.title = input.title;
  if (input.link !== undefined) banner.link = input.link;
  if (input.sortOrder !== undefined) banner.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) banner.isActive = input.isActive;
  if (req.file) {
    if (banner.image) await storageService.delete(banner.image);
    banner.image = await storageService.upload(req.file, 'banners');
  }
  await banner.save();
  res.json({ success: true, data: banner });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);
  if (!banner) throw new NotFoundError('Banner not found');
  if (banner.image) await storageService.delete(banner.image);
  await banner.destroy();
  res.json({ success: true, message: 'Banner deleted' });
});
