import express, { json } from 'express';
import pino from 'pino-http';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import router from './routers/routers.js';
import cookieParser from 'cookie-parser';
import { APP_PORT, UPLOAD_DIR } from './constants/constants.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(APP_PORT, '3000');

export function startServer() {
  const app = express();

  app.use(
    json({
      type: ['application/json'],
      limit: '100kb',
    }),
  );

  app.use(cors());

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.use(router);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api-docs', swaggerDocs());

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
