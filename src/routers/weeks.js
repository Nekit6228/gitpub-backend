import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getCurrentWeekController,
  getWeekController,
  getWeekBabyController,
  getWeekMomController,
  getWeekEmotionsController,
} from '../controllers/weeks.js';
import { weekParamSchema, dueDateQuerySchema } from '../validation/weeks.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get(
  '/current',
  validate(dueDateQuerySchema, 'query'),
  getCurrentWeekController,
);

router.use(authenticate);

router.get('/:week', validate(weekParamSchema), getWeekController);

router.get('/:week/baby', validate(weekParamSchema), getWeekBabyController);

router.get('/:week/mom', validate(weekParamSchema), getWeekMomController);

router.get(
  '/:week/emotions',
  validate(weekParamSchema),
  getWeekEmotionsController,
);

export default router;
