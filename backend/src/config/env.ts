import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  AES_SECRET_KEY: z.string().min(32),
  FRONTEND_URL: z.string().min(1),
  WEBSITE_URL: z.string().optional(),
  COOKIE_DOMAIN: z.string().default('localhost'),
  COOKIE_SECURE: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),
  UPLOAD_TO_AWS: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  MAX_FILE_SIZE: z
    .string()
    .transform((v) => parseInt(v, 10))
    .default('5242880'),
  ADMIN_NAME: z.string().default('Admin User'),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export function getAllowedOrigins(): string[] {
  const list = [env.FRONTEND_URL];
  if (env.WEBSITE_URL) list.push(env.WEBSITE_URL);
  // Also allow common local website ports
  list.push('http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000');
  return [...new Set(list.map((u) => u.replace(/\/$/, '')))];
}

export type Env = z.infer<typeof envSchema>;
