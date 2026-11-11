// import { Op } from 'sequelize';
// import { Offer } from '../models';
// import { CreateOfferInput, UpdateOfferInput } from '../validators/offer.validator';
// import { NotFoundError } from '../utils/errors';
// import { storageService } from './StorageService';

// export class OfferService {
//   async list(query: { page?: number; limit?: number; search?: string; status?: string; activeOnly?: boolean }) {
//     const page = query.page || 1;
//     const limit = Math.min(query.limit || 20, 100);
//     const offset = (page - 1) * limit;

//     const where: Record<string, unknown> = {};
//     if (query.search) {
//       where.title = { [Op.iLike]: `%${query.search}%` };
//     }
//     if (query.status === 'active') where.isActive = true;
//     if (query.status === 'inactive') where.isActive = false;
//     if (query.activeOnly) {
//       where.isActive = true;
//       where.startDate = { [Op.lte]: new Date() };
//       where.endDate = { [Op.gte]: new Date() };
//     }

//     const { rows, count } = await Offer.findAndCountAll({
//       where,
//       order: [['createdAt', 'DESC']],
//       limit,
//       offset,
//     });

//     return {
//       data: rows,
//       meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
//     };
//   }

//   async getById(id: string) {
//     const offer = await Offer.findByPk(id);
//     if (!offer) throw new NotFoundError('Offer not found');
//     return offer;
//   }

//   async create(input: CreateOfferInput, imageUrl?: string) {
//     return Offer.create({
//       title: input.title,
//       description: input.description || null,
//       discountType: input.discountType,
//       discountValue: input.discountValue,
//       startDate: new Date(input.startDate),
//       endDate: new Date(input.endDate),
//       isActive: input.isActive ?? true,
//       applicableTo: input.applicableTo || 'all',
//       productIds: input.productIds || null,
//       categoryIds: input.categoryIds || null,
//       image: imageUrl || null,
//     });
//   }

//   async update(id: string, input: UpdateOfferInput, imageUrl?: string) {
//     const offer = await Offer.findByPk(id);
//     if (!offer) throw new NotFoundError('Offer not found');

//     if (input.title) offer.title = input.title;
//     if (input.description !== undefined) offer.description = input.description;
//     if (input.discountType) offer.discountType = input.discountType;
//     if (input.discountValue !== undefined) offer.discountValue = input.discountValue;
//     if (input.startDate) offer.startDate = new Date(input.startDate);
//     if (input.endDate) offer.endDate = new Date(input.endDate);
//     if (input.isActive !== undefined) offer.isActive = input.isActive;
//     if (input.applicableTo) offer.applicableTo = input.applicableTo;
//     if (input.productIds !== undefined) offer.productIds = input.productIds;
//     if (input.categoryIds !== undefined) offer.categoryIds = input.categoryIds;
//     if (imageUrl) {
//       if (offer.image) await storageService.delete(offer.image);
//       offer.image = imageUrl;
//     }

//     await offer.save();
//     return offer;
//   }

//   async delete(id: string) {
//     const offer = await Offer.findByPk(id);
//     if (!offer) throw new NotFoundError('Offer not found');
//     if (offer.image) await storageService.delete(offer.image);
//     await offer.destroy();
//   }
// }

// export const offerService = new OfferService();




import { Op } from 'sequelize';
import { Offer } from '../models';
import { CreateOfferInput, UpdateOfferInput } from '../validators/offer.validator';
import { NotFoundError } from '../utils/errors';
import { storageService } from './StorageService';

export class OfferService {
  async list(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    activeOnly?: boolean;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.title = { [Op.iLike]: `%${query.search}%` };
    }
    if (query.status === 'active') where.isActive = true;
    if (query.status === 'inactive') where.isActive = false;
    if (query.activeOnly) {
      where.isActive = true;
      where.startDate = { [Op.lte]: new Date() };
      where.endDate = { [Op.gte]: new Date() };
    }

    const { rows, count } = await Offer.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async getById(id: string) {
    const offer = await Offer.findByPk(id);
    if (!offer) throw new NotFoundError('Offer not found');
    return offer;
  }

  async create(input: CreateOfferInput, imageUrl?: string) {
    const kind = input.offerKind || 'menu';
    return Offer.create({
      title: input.title,
      description: input.description || null,
      discountType: input.discountType,
      discountValue: input.discountValue,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      isActive: input.isActive ?? true,
      applicableTo: kind === 'loyalty' ? 'all' : input.applicableTo || 'all',
      productIds: kind === 'menu' && input.applicableTo === 'products' ? input.productIds || null : null,
      categoryIds:
        kind === 'menu' && input.applicableTo === 'categories' ? input.categoryIds || null : null,
      image: imageUrl || null,
      offerKind: kind,
      minOrderCount: kind === 'loyalty' ? input.minOrderCount ?? null : null,
    });
  }

  async update(id: string, input: UpdateOfferInput, imageUrl?: string) {
    const offer = await Offer.findByPk(id);
    if (!offer) throw new NotFoundError('Offer not found');

    if (input.title) offer.title = input.title;
    if (input.description !== undefined) offer.description = input.description;
    if (input.discountType) offer.discountType = input.discountType;
    if (input.discountValue !== undefined) offer.discountValue = input.discountValue;
    if (input.startDate) offer.startDate = new Date(input.startDate);
    if (input.endDate) offer.endDate = new Date(input.endDate);
    if (input.isActive !== undefined) offer.isActive = input.isActive;
    if (input.offerKind) offer.offerKind = input.offerKind;

    const kind = input.offerKind ?? offer.offerKind;

    if (kind === 'loyalty') {
      offer.applicableTo = 'all';
      offer.productIds = null;
      offer.categoryIds = null;
      if (input.minOrderCount !== undefined) offer.minOrderCount = input.minOrderCount;
    } else {
      if (input.applicableTo) offer.applicableTo = input.applicableTo;
      if (input.productIds !== undefined) offer.productIds = input.productIds;
      if (input.categoryIds !== undefined) offer.categoryIds = input.categoryIds;
      offer.minOrderCount = null;
    }

    if (imageUrl) {
      if (offer.image) await storageService.delete(offer.image);
      offer.image = imageUrl;
    }

    await offer.save();
    return offer;
  }

  async delete(id: string) {
    const offer = await Offer.findByPk(id);
    if (!offer) throw new NotFoundError('Offer not found');
    if (offer.image) await storageService.delete(offer.image);
    await offer.destroy();
  }
}

export const offerService = new OfferService();