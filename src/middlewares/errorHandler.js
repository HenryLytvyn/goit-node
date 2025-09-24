import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export default function errorHandler(err, req, res, next) {
  // if (err) {
  //   res.status(err.status).json({
  //     status: err.status,
  //     message: err.name,
  //     errors: err.details.map((err) => ({
  //       path: err.path,
  //       message: err.message,
  //     })),
  //   });
  //   return;
  // }

  if (isHttpError(err)) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      // data: err,
      errors: err.message,
    });
    return;
  }

  if (err.isJoi) {
    res.status(400).json({
      status: err.status,
      message: 'Bad request',
      // data: err,
      errors: err.details.map((err) => ({
        path: err.path,
        message: err.message,
      })),
    });
    return;
  }

  if (err instanceof MongooseError) {
    res.status(500).json({
      status: 500,
      message: err.message,
      id: req.id,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
}
