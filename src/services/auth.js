import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';
import SessionsCollection from '../db/models/session.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/constants.js';

export async function registerUser(payload) {
  const isUserExist = await UsersCollection.findOne({ email: payload.email });
  if (isUserExist) throw createHttpError(409, 'User already exist!');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  return user;
}

export async function loginUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordEqual = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.findOneAndDelete({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = {
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenExpires: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenExpires: new Date(Date.now() + ONE_DAY),
  };

  return session;
}

export async function logoutUser(sessionId) {
  await SessionsCollection.findByIdAndDelete(sessionId);
}

export function createSession() {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenExpires: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenExpires: new Date(Date.now() + ONE_DAY),
  };
}

export async function refreshUsersSession({ sessionId, refreshToken }) {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenExpires);

  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  const newSession = createSession();

  await SessionsCollection.findOneAndDelete({ _id: sessionId, refreshToken });

  return SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
}
