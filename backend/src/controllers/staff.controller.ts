import { Response } from 'express';
import { AuthRequest } from '../types';
import { staffService } from '../services/StaffService';
import { createStaffSchema, updateStaffSchema } from '../validators/staff.validator';
import { asyncHandler } from '../utils/asyncHandler';

export const listStaff = asyncHandler(async (req, res) => {
  const result = await staffService.list({
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    search: req.query.search as string,
    status: req.query.status as string,
  });
  res.json({ success: true, ...result });
});

export const getStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.getById(req.params.id);
  res.json({ success: true, data: staff });
});

export const createStaff = asyncHandler(async (req, res) => {
  const input = createStaffSchema.parse(req.body);
  const staff = await staffService.create(input);
  res.status(201).json({ success: true, data: staff });
});

export const updateStaff = asyncHandler(async (req, res) => {
  const input = updateStaffSchema.parse(req.body);
  const staff = await staffService.update(req.params.id, input);
  res.json({ success: true, data: staff });
});

export const deleteStaff = asyncHandler(async (req, res) => {
  await staffService.delete(req.params.id);
  res.json({ success: true, message: 'Staff deleted successfully' });
});

export const toggleStaffStatus = asyncHandler(async (req, res) => {
  const result = await staffService.toggleStatus(req.params.id);
  res.json({ success: true, data: result });
});
