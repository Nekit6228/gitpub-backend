import { Router } from 'express';

import {
  createTaskController,
  getTaskController,
  patchTaskController,
} from '../controllers/task.js';
import { createTaskSchema, updateTaskSchema } from '../validation/task.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

// import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

// router.use(authenticate);

router.get('/', ctrlWrapper(getTaskController));

router.post(
  '/',
  validateBody(createTaskSchema),
  ctrlWrapper(createTaskController),
);

router.patch(
  '/:taskId',
  validateBody(updateTaskSchema),
  ctrlWrapper(patchTaskController),
);

export default router;
