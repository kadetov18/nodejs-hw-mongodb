import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserValid, registerUserValid } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserValid),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserValid),
  ctrlWrapper(loginUserController),
);
router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;
