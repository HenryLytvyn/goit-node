import { ONE_DAY } from '../constants/constants.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';

export async function setupSession(res, session) {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
}

export async function registerUserController(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'User created successfully!',
    data: user,
  });
}

export async function loginUserController(req, res) {
  const session = await loginUser(req.body);

  // res.cookie('refreshToken', session.refreshToken, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + ONE_DAY),
  // });

  // res.cookie('sessionId', session._id, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + ONE_DAY),
  // });

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully loged in!',
    data: { accessToken: session.accessToken },
  });
}

export async function logoutUserController(req, res) {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

export async function refreshUsersSessionController(req, res) {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  await setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'The session was successfully refreshed!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
