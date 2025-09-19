import { Router } from "express";
import authRouter from './auth.js';
import diaryRouter from './diary.js';


const router = Router();


router.use('api/auth', authRouter);
router.use('/diaries', diaryRouter);


export default router;
