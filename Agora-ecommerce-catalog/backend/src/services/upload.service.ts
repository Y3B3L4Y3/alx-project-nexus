import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Storage configuration for local uploads
const localStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Memory storage for S3 uploads
const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.', 400));
  }
};

// Create multer instances
export const uploadLocal = multer({
  storage: localStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export const uploadToMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// Upload to S3 (placeholder - requires aws-sdk)
export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string = 'products'
): Promise<string> => {
  if (!env.aws.accessKeyId || !env.aws.secretAccessKey) {
    throw new AppError('AWS credentials not configured', 500);
  }

  // TODO: Implement actual S3 upload
  // For now, return a placeholder URL
  const filename = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;
  return `https://${env.aws.bucketName}.s3.${env.aws.region}.amazonaws.com/${filename}`;
};

// Get upload URL (local or S3)
export const getUploadUrl = (filename: string): string => {
  if (env.isProduction && env.aws.bucketName) {
    return `https://${env.aws.bucketName}.s3.${env.aws.region}.amazonaws.com/${filename}`;
  }
  return `/uploads/${filename}`;
};

// Delete file
export const deleteFile = async (fileUrl: string): Promise<void> => {
  // TODO: Implement file deletion for local and S3
  console.log(`Deleting file: ${fileUrl}`);
};

export default {
  uploadLocal,
  uploadToMemory,
  uploadToS3,
  getUploadUrl,
  deleteFile,
};

