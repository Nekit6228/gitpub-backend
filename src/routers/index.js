import { Router } from 'express';
import authRouter from './auth.js';
import diaryRouter from './diary.js';
import emotionRouter from './emotions.js';
import usersRouter from './user.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/users', usersRouter);

router.use('/diaries', diaryRouter);
router.use('/emotions', emotionRouter);

export default router;
