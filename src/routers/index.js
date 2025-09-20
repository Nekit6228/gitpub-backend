import { Router } from 'express';
import authRouter from './auth.js';
import weeksRouter from './weeks.js';

const router = Router();

router.use('/auth', authRouter);

export default router;
