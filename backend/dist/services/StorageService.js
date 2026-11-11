"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = exports.StorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
class StorageService {
    s3 = null;
    uploadToAws;
    constructor() {
        this.uploadToAws = env_1.env.UPLOAD_TO_AWS;
        if (this.uploadToAws) {
            if (!env_1.env.AWS_ACCESS_KEY_ID || !env_1.env.AWS_SECRET_ACCESS_KEY || !env_1.env.AWS_S3_BUCKET || !env_1.env.AWS_REGION) {
                throw new Error('AWS credentials and bucket are required when UPLOAD_TO_AWS=true');
            }
            this.s3 = new aws_sdk_1.default.S3({
                accessKeyId: env_1.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env_1.env.AWS_SECRET_ACCESS_KEY,
                region: env_1.env.AWS_REGION,
            });
        }
    }
    validateFile(file) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new errors_1.AppError('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.', 400);
        }
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            throw new errors_1.AppError('Invalid file extension.', 400);
        }
        if (file.size > env_1.env.MAX_FILE_SIZE) {
            throw new errors_1.AppError(`File size exceeds maximum allowed size of ${env_1.env.MAX_FILE_SIZE} bytes.`, 400);
        }
    }
    generateKey(originalName, folder = 'uploads') {
        const ext = path_1.default.extname(originalName).toLowerCase() || '.jpg';
        const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.jpg';
        return `${folder}/${(0, uuid_1.v4)()}${safeExt}`;
    }
    async upload(file, folder = 'uploads') {
        this.validateFile(file);
        const key = this.generateKey(file.originalname, folder);
        if (this.uploadToAws && this.s3) {
            const params = {
                Bucket: env_1.env.AWS_S3_BUCKET,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };
            const result = await this.s3.upload(params).promise();
            return result.Location;
        }
        // Local storage
        const uploadDir = path_1.default.join(process.cwd(), 'uploads', folder);
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path_1.default.join(uploadDir, path_1.default.basename(key));
        fs_1.default.writeFileSync(filePath, file.buffer);
        return `/uploads/${folder}/${path_1.default.basename(key)}`;
    }
    async delete(fileUrl) {
        if (!fileUrl)
            return;
        if (this.uploadToAws && this.s3) {
            try {
                const url = new URL(fileUrl);
                const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
                await this.s3
                    .deleteObject({
                    Bucket: env_1.env.AWS_S3_BUCKET,
                    Key: key,
                })
                    .promise();
            }
            catch {
                // Ignore delete errors
            }
            return;
        }
        // Local
        try {
            const relative = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
            const fullPath = path_1.default.join(process.cwd(), relative);
            if (fs_1.default.existsSync(fullPath)) {
                fs_1.default.unlinkSync(fullPath);
            }
        }
        catch {
            // Ignore
        }
    }
}
exports.StorageService = StorageService;
exports.storageService = new StorageService();
//# sourceMappingURL=StorageService.js.map