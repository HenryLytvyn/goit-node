import path from 'node:path';
import fs from 'node:fs/promises';
import { OAuth2Client } from 'google-auth-library';
import {
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_SECRET,
} from '../constants/constants.js';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const oauthConfig = JSON.parse(await fs.readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({
  client_id: GOOGLE_AUTH_CLIENT_ID,
  client_secret: GOOGLE_AUTH_CLIENT_SECRET,
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export function generateAuthUrl() {
  return googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unathorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
}

export function getFullNameFromGoogleTokenPayload(payload) {
  let fullName = 'Guest';
  if (payload.given_name && payload.last_name) {
    fullName = `${payload.given_name} ${payload.last_name}`;
  } else if (payload.given_name) {
    fullName = `${payload.given_name}`;
  }

  return fullName;
}
