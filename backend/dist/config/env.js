"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.getAllowedOrigins = getAllowedOrigins;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('5000'),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    ACCESS_TOKEN_EXPIRES_IN: zod_1.z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default('7d'),
    AES_SECRET_KEY: zod_1.z.string().min(32),
    FRONTEND_URL: zod_1.z.string().min(1),
    WEBSITE_URL: zod_1.z.string().optional(),
    COOKIE_DOMAIN: zod_1.z.string().default('localhost'),
    COOKIE_SECURE: zod_1.z
        .string()
        .transform((v) => v === 'true')
        .default('false'),
    COOKIE_SAME_SITE: zod_1.z.enum(['strict', 'lax', 'none']).default('lax'),
    UPLOAD_TO_AWS: zod_1.z
        .string()
        .transform((v) => v === 'true')
        .default('false'),
    AWS_ACCESS_KEY_ID: zod_1.z.string().optional(),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().optional(),
    AWS_REGION: zod_1.z.string().optional(),
    AWS_S3_BUCKET: zod_1.z.string().optional(),
    MAX_FILE_SIZE: zod_1.z
        .string()
        .transform((v) => parseInt(v, 10))
        .default('5242880'),
    ADMIN_NAME: zod_1.z.string().default('Admin User'),
    ADMIN_EMAIL: zod_1.z.string().email(),
    ADMIN_PASSWORD: zod_1.z.string().min(8),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
function getAllowedOrigins() {
    const list = [
        exports.env.FRONTEND_URL,
        'https://lotushut.bluewebspark.com',
        'http://lotushut.bluewebspark.com',
    ];
    if (exports.env.WEBSITE_URL)
        list.push(exports.env.WEBSITE_URL);
    // Also allow common local website ports
    list.push('http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000');
    return [...new Set(list.map((u) => u.replace(/\/$/, '')))];
}
//# sourceMappingURL=env.js.map