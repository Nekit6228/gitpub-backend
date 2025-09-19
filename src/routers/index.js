import { Router } from "express";
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import usersRouter from "./user.js";

const router = Router();

router.use('/contacts',contactsRouter);
router.use('/auth', authRouter);
router.use("/api/auth", authRouter);
router.use("/api/users", usersRouter);

export default router;
