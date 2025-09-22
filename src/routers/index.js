import { Router } from 'express';
import authRouter from './auth.js';
import diaryRouter from './diary.js';
import emotionRouter from './emotions.js';
import usersRouter from './user.js';
import weeksRouter from './weeks.js';
import tasksRouter from './tasks.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/tasks', tasksRouter);
router.use('/weeks', weeksRouter);
router.use('/diaries', diaryRouter);
router.use('/emotions', emotionRouter);

export default router;
