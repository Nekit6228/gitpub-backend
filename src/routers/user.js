import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import multer from "multer";
import { getMe, updateAvatar, updateUser } from "../controllers/user.js";
import { refreshUserSessionController } from "../controllers/auth.js";


const router = Router();
const upload = multer({ dest: "uploads/" });

router.use(authenticate);

// GET /api/users/me — поточний користувач
router.get("/me", ctrlWrapper(getMe));

// POST /api/users/avatar — оновлення аватару
router.post("/avatar", upload.single("avatar"), ctrlWrapper(updateAvatar));

// PATCH /api/users — оновлення даних + refreshUserSession
router.patch("/", ctrlWrapper(updateUser));

// POST /api/users/refresh — оновлення токена
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;