"use strict";
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import { env, getAllowedOrigins } from './config/env';
// import { globalLimiter } from './middlewares/rateLimiter';
// import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
// import routes from './routes';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// const allowedOrigins = getAllowedOrigins();
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: 'cross-origin' },
// }));
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow non-browser / same-origin and configured fronts
//       if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
//         callback(null, true);
//         return;
//       }
//       // Dev-friendly: allow localhost any port
//       if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
//         callback(null, true);
//         return;
//       }
//       callback(null, true);
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );
// app.use(globalLimiter);
// app.use(express.json({ limit: '1mb' }));
// app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// app.use(cookieParser());
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// app.use('/api', routes);
// app.get('/health', (_req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });
// app.use(notFoundHandler);
// app.use(errorHandler);
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const allowedOrigins = (0, env_1.getAllowedOrigins)();
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow non-browser / same-origin and configured fronts
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
            callback(null, true);
            return;
        }
        // Dev-friendly: allow localhost any port
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            callback(null, true);
            return;
        }
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-guest-key',
        'X-Guest-Key',
    ],
}));
app.use(rateLimiter_1.globalLimiter);
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use('/api', routes_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map