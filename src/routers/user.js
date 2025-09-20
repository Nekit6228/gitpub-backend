import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import multer from "multer";
import { getMe, updateAvatar, updateUser } from "../controllers/user.js";
import { refreshUserSessionController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { updateUserSchema } from "../schemas/user.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.use(authenticate);

router.get("/me", ctrlWrapper(getMe));
router.post("/avatar", upload.single("avatar"), ctrlWrapper(updateAvatar));
router.patch("/", validateBody(updateUserSchema), ctrlWrapper(updateUser)); // <-- ДОДАНО!
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;