import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  // checkSessionController,
  loginUserController,
  logoutUserController,
  // refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

// router.post('/refresh', ctrlWrapper(refreshUserSessionController));

// router.get('/session', checkSessionController, (req, res) => {
//   res.status(200).json({
//     message: 'Сесія активна',
//     user: req.user,
//   });
// });

export default router;
