import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getCurrentWeekController,
  getPublicCurrentWeekController,
  getWeekController,
  getWeekBabyController,
  getWeekMomController,
  getWeekEmotionsController,
} from '../controllers/weeks.js';
import { weekParamSchema, dueDateQuerySchema } from '../validation/weeks.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/current/public', getPublicCurrentWeekController);

router.use(authenticate);

router.get(
  '/current',
  validate(dueDateQuerySchema, 'query'),
  getCurrentWeekController,
);

router.get('/:weekNumber', validate(weekParamSchema), getWeekController);

router.get(
  '/:weekNumber/baby',
  validate(weekParamSchema),
  getWeekBabyController,
);

router.get('/:weekNumber/mom', validate(weekParamSchema), getWeekMomController);

router.get(
  '/:weekNumber/emotions',
  validate(weekParamSchema),
  getWeekEmotionsController,
);

export default router;

