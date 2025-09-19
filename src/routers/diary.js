import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getUserDiaryController } from '../controllers/diary.js';

const router = Router();


router.get('/',
           authenticate,
           ctrlWrapper(getUserDiaryController)
);

export default router;