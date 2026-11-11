"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const DashboardService_1 = require("../services/DashboardService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getStats = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const stats = await DashboardService_1.dashboardService.getStats();
    res.json({ success: true, data: stats });
});
//# sourceMappingURL=dashboard.controller.js.map