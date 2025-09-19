import { Router } from "express";
import authRouter from './auth.js';
import diaryRouter from './diary.js';
import emotionRouter from './emotions.js'


const router = Router();


router.use('/auth', authRouter);
router.use('/diaries', diaryRouter);
router.use('/emotions', emotionRouter);

export default router;
