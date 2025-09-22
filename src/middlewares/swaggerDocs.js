import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import { Router } from 'express';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  const router = Router();
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    router.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    return router;
  } catch {
    router.use((req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"))
    );
    return router;
  }
};
