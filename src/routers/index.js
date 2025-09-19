import { Router } from "express";
import authRouter from './auth.js';
import usersRouter from "./user.js";

const router = Router();


router.use('/auth', authRouter);
router.use("/api/auth", authRouter);
router.use("/api/users", usersRouter);

export default router;
