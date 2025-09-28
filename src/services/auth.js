import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';

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
