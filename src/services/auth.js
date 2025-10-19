import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'node:path';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import { randomBytes } from 'crypto';

import UsersCollection from '../db/models/user.js';
import SessionsCollection from '../db/models/session.js';
import {
  APP_DOMAIN,
  FIFTEEN_MINUTES,
  JWT_SECRET,
  ONE_DAY,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/constants.js';
import sendEmail from '../utils/sendEmail.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';

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

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenExpires: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenExpires: new Date(Date.now() + ONE_DAY),
  });

  return session;
}

export async function logoutUser(sessionId) {
  await deleteSession(sessionId);
}

function createSession(userId) {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    userId,
    accessToken,
    refreshToken,
    accessTokenExpires: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenExpires: new Date(Date.now() + ONE_DAY),
  };
}

export async function deleteSession(sessionId) {
  const isSessionExist = await SessionsCollection.findById(sessionId);
  if (!isSessionExist) throw createHttpError(401, 'Session does not exist!');

  await SessionsCollection.findByIdAndDelete(sessionId);
}

export async function refreshUsersSession({ sessionId, refreshToken }) {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenExpires);

  if (isSessionTokenExpired) {
    await deleteSession(sessionId); // just in case
    throw createHttpError(401, 'Session token expired!');
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    await deleteSession(sessionId); // just in case
    throw createHttpError(401, 'User not found!');
  }

  await SessionsCollection.findOneAndDelete({ _id: sessionId, refreshToken });

  const newSession = await SessionsCollection.create(createSession(user._id));

  return newSession;
}

export async function requestResetToken(email) {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    JWT_SECRET,
    { expiresIn: '15m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf8');

  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${APP_DOMAIN}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: SMTP.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html,
  });
}

export async function resetPassword(payload) {
  let entries;

  try {
    entries = jwt.verify(payload.token, JWT_SECRET);
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    _id: entries.sub,
    email: entries.email,
  });

  if (!user) throw createHttpError(404, 'User not found!');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
}

export async function loginOrSignUpWithGoogle(code) {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) createHttpError(401, 'Unathorized');

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      name: getFullNameFromGoogleTokenPayload(payload),
      email: payload.email,
      role: 'parent',
      password,
    });
  }

  const newSession = createSession(user._id);
  return await SessionsCollection.create(newSession);
}
