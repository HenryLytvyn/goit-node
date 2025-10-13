import path from 'node:path';
import getEnvVar, { getEnvBool } from '../utils/getEnvVar.js';

export const APP_DOMAIN = getEnvVar('APP_DOMAIN');
export const APP_PORT = getEnvVar('PORT');

export const MONGODB_USER = getEnvVar('MONGODB_USER');
export const MONGODB_PASSWORD = getEnvVar('MONGODB_PASSWORD');
export const MONGODB_URL = getEnvVar('MONGODB_URL');
export const MONGODB_DB = getEnvVar('MONGODB_DB');

export const SMTP = {
  SMTP_HOST: getEnvVar('SMTP_HOST'),
  SMTP_PORT: getEnvVar('SMTP_PORT'),
  SMTP_USER: getEnvVar('SMTP_USER'),
  SMTP_PASSWORD: getEnvVar('SMTP_PASSWORD'),
  SMTP_FROM: getEnvVar('SMTP_FROM'),
};

export const JWT_SECRET = getEnvVar('JWT_SECRET');

export const CLOUDINARY = {
  CLOUD_NAME: getEnvVar('CLOUD_NAME'),
  API_KEY: getEnvVar('API_KEY'),
  API_SECRET: getEnvVar('API_SECRET'),
};

export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 1000 * 60 * 15;
export const ONE_DAY = 1000 * 60 * 60 * 24;

export const ROLES = {
  TEACHER: 'teacher',
  PARENT: 'parent',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const ENABLE_CLOUDINARY = getEnvBool('ENABLE_CLOUDINARY');
