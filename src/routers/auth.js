import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  loginUserController,
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

export default authRouter;
