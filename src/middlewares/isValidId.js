import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export default function isValidId(req, res, next) {
  const { studentId } = req.params;

  if (!isValidObjectId(studentId)) {
    next(createHttpError(400, 'Bad request'));
    return;
  }

  next();
}
