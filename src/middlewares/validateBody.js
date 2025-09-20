import createHttpError from 'http-errors';
import { createStudentValSchema } from '../validation/students.js';

export function validateBody(schema) {
  return async function validateBodyMiddleware(req, res, next) {
    try {
      await schema.validateAsync(createStudentValSchema, { abortEarly: false });
      next();
    } catch (err) {
      const error = createHttpError(400, 'Bad request', {
        errors: err.details,
      });
      next(error);
    }

    // await schema.validateAsync(createStudentValSchema, { abortEarly: false });
    // next();
  };
}
