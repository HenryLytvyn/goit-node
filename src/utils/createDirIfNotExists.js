import fs from 'node:fs/promises';

export default async function createDirIfNotExist(url) {
  try {
    await fs.access(url);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
}
