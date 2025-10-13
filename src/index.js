import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/constants.js';
import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';
import createDirIfNotExist from './utils/createDirIfNotExists.js';

async function bootStrap() {
  await initMongoDB();
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOAD_DIR);
  startServer();
}

bootStrap();
