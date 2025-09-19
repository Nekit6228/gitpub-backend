import { Router } from "express";
import authRouter from "./auth.js";

const router = Router();

// ❌ було: router.use('api/auth', authRouter);
router.use("/auth", authRouter);   // ✅ правильно

console.log("Mounted /auth (inside /api)");

export default router;







