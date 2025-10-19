import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserValidationSchema,
  loginWithGoogleOAuthSchema,
  registerUserValidationSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  getGoogleOAuthUrlController,
  loginUserController,
  loginWithGoogleController,
  logoutUserController,
  refreshUsersSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/auth/register',
  validateBody(registerUserValidationSchema),
  registerUserController,
);

authRouter.post(
  '/auth/login',
  validateBody(loginUserValidationSchema),
  loginUserController,
);

authRouter.post('/auth/logout', logoutUserController);

authRouter.post('/auth/refresh', refreshUsersSessionController);

authRouter.post(
  '/auth/request-reset-email',
  validateBody(requestResetEmailSchema),
  requestResetEmailController,
);

authRouter.post(
  '/auth/reset-password',
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

authRouter.get('/auth/get-oauth-url', getGoogleOAuthUrlController);

authRouter.post(
  '/auth/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  loginWithGoogleController,
);

export default authRouter;
