import { Router } from 'express';
// import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getMeController,
  patchUserController,
  updateAvatar,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateUserSchema } from '../validation/user.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

// router.use(authenticate);

router.get('/me', ctrlWrapper(getMeController));
router.post('/avatar', upload.single('avatar'), ctrlWrapper(updateAvatar));

router.patch(
  '/',
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(patchUserController),
);

export default router;
