import { Router } from "express";
import authRouter from './auth.js';


const router = Router();


router.use('api/auth', authRouter);


export default router;
