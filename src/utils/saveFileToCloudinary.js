import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

/**
 * Завантажує файл у Cloudinary та повертає secure_url.
 * @param {Object} file - Об'єкт файлу з multer (file.path).
 * @returns {Promise<string>} - secure_url завантаженого зображення.
 */
export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path, {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 250, height: 250, crop: 'fill' }],
  });
  await fs.unlink(file.path);
  return response.secure_url;
};