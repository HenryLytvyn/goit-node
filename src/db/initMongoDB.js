import mongoose from 'mongoose';
import {
  MONGODB_DB,
  MONGODB_PASSWORD,
  MONGODB_URL,
  MONGODB_USER,
} from '../constants/constants.js';

export async function initMongoDB() {
  try {
    const user = MONGODB_USER;
    const pwd = MONGODB_PASSWORD;
    const url = MONGODB_URL;
    const db = MONGODB_DB;

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('MongoDB connected successful');
  } catch (err) {
    console.log('Error to connect MongoDB: ', err);
    throw err;
  }
}
