import fs from 'node:fs/promises';
import path from 'node:path';
import {
  APP_DOMAIN,
  TEMP_UPLOAD_DIR,
  UPLOAD_DIR,
} from '../constants/constants.js';

export default async function saveFileToUploadDir(file) {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${APP_DOMAIN}/uploads/${file.filename}`;
}
