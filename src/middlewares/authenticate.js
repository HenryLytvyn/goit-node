import createHttpError from 'http-errors';
import SessionsCollection from '../db/models/session.js';
import UsersCollection from '../db/models/user.js';
import { deleteSession } from '../services/auth.js';

export default async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Error of authorization header'));
  }

  const [headerType, accessToken] = authHeader.split(' ');

  if (headerType !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Token should be of type Bearer!'));
  }

  const session = await SessionsCollection.findOne({ accessToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found!'));
  }

  const isAccessTokenExpired = new Date() > session.accessTokenExpires;

  //   console.log(new Date(session.accessTokenExpires));
  //   console.log(session.accessTokenExpires);
  //   console.log(new Date());
  //   console.log(Date.now());

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired!'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    await deleteSession(session._id);
    next(createHttpError(401, 'User associated with session is not found!'));
  }

  req.user = user;

  next();
}
