import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import multer from "multer";
import { getMe, updateAvatar, updateUser } from "../controllers/user.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.use(authenticate);

// GET /api/users/me — поточний користувач
router.get("/me", ctrlWrapper(getMe));

// PATCH /api/users/avatar — оновлення аватару
router.post("/avatar", upload.single("avatar"), ctrlWrapper(updateAvatar));

// PATCH /api/users — оновлення даних + refreshUserSession
router.patch("/", ctrlWrapper(updateUser));

export default router;