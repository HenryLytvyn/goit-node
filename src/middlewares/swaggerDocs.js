import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/constants.js';
import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';

export function swaggerDocs() {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH), 'utf8');
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch {
    return function (req, res, next) {
      next(createHttpError(500, "Can't load swagger docs"));
    };
  }
}
