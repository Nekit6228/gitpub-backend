import { Router } from 'express';
import authRouter from './auth.js';
import weeksRouter from './weeks.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/weeks', weeksRouter);

export default router;
