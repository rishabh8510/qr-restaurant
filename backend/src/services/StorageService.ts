import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export class StorageService {
  private s3: AWS.S3 | null = null;
  private uploadToAws: boolean;

  constructor() {
    this.uploadToAws = env.UPLOAD_TO_AWS;
    if (this.uploadToAws) {
      if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET || !env.AWS_REGION) {
        throw new Error('AWS credentials and bucket are required when UPLOAD_TO_AWS=true');
      }
      this.s3 = new AWS.S3({
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        region: env.AWS_REGION,
      });
    }
  }

  validateFile(file: Express.Multer.File): void {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new AppError('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.', 400);
    }
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new AppError('Invalid file extension.', 400);
    }
    if (file.size > env.MAX_FILE_SIZE) {
      throw new AppError(`File size exceeds maximum allowed size of ${env.MAX_FILE_SIZE} bytes.`, 400);
    }
  }

  private generateKey(originalName: string, folder = 'uploads'): string {
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.jpg';
    return `${folder}/${uuidv4()}${safeExt}`;
  }

  async upload(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    this.validateFile(file);
    const key = this.generateKey(file.originalname, folder);

    if (this.uploadToAws && this.s3) {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: env.AWS_S3_BUCKET!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
      const result = await this.s3.upload(params).promise();
      return result.Location;
    }

    // Local storage
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, path.basename(key));
    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${folder}/${path.basename(key)}`;
  }

  async delete(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    if (this.uploadToAws && this.s3) {
      try {
        const url = new URL(fileUrl);
        const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
        await this.s3
          .deleteObject({
            Bucket: env.AWS_S3_BUCKET!,
            Key: key,
          })
          .promise();
      } catch {
        // Ignore delete errors
      }
      return;
    }

    // Local
    try {
      const relative = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
      const fullPath = path.join(process.cwd(), relative);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch {
      // Ignore
    }
  }
}

export const storageService = new StorageService();
