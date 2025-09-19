import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getUserDiaryController, createDiaryController } from '../controllers/diary.js';
import { createDiarySchema } from '../validation/diary.js';
import { validateBody } from '../middlewares/validateBody.js'

const router = Router();


router.get('/',
           authenticate,
           ctrlWrapper(getUserDiaryController)
);

router.post('/',
            authenticate,
            validateBody(createDiarySchema),
            ctrlWrapper(createDiaryController)
);

export default router; 