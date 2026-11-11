"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStaffStatus = exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.getStaff = exports.listStaff = void 0;
const StaffService_1 = require("../services/StaffService");
const staff_validator_1 = require("../validators/staff.validator");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.listStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await StaffService_1.staffService.list({
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
        search: req.query.search,
        status: req.query.status,
    });
    res.json({ success: true, ...result });
});
exports.getStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const staff = await StaffService_1.staffService.getById(req.params.id);
    res.json({ success: true, data: staff });
});
exports.createStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = staff_validator_1.createStaffSchema.parse(req.body);
    const staff = await StaffService_1.staffService.create(input);
    res.status(201).json({ success: true, data: staff });
});
exports.updateStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = staff_validator_1.updateStaffSchema.parse(req.body);
    const staff = await StaffService_1.staffService.update(req.params.id, input);
    res.json({ success: true, data: staff });
});
exports.deleteStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await StaffService_1.staffService.delete(req.params.id);
    res.json({ success: true, message: 'Staff deleted successfully' });
});
exports.toggleStaffStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await StaffService_1.staffService.toggleStatus(req.params.id);
    res.json({ success: true, data: result });
});
//# sourceMappingURL=staff.controller.js.map