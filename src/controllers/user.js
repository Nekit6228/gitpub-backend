import { SessionsCollection } from "../db/models/session.js";
import { generateAccessToken } from "../utils/token.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js"; // Додаємо Cloudinary утиліту

// Отримати поточного користувача
export const getMe = async (req, res) => {
  res.json(req.user);
};

// Оновити аватар через Cloudinary
export const updateAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Avatar file required" });

  // Завантаження у Cloudinary
  const avatarUrl = await saveFileToCloudinary(req.file);

  req.user.avatar = avatarUrl;
  await req.user.save();

  res.json({ avatar: avatarUrl });
};


export const updateUser = async (req, res) => {
  if (req.body.name) req.user.name = req.body.name;
  if (req.body.email) req.user.email = req.body.email;
  if (req.body.gender) req.user.gender = req.body.gender;
  if (req.body.dueDate) req.user.dueDate = new Date(req.body.dueDate);

  await req.user.save();

  const session = await SessionsCollection.findOne({ userId: req.user._id });
  if (!session) return res.status(401).json({ error: "Session not found" });

  session.accessToken = generateAccessToken(req.user);
  session.accessTokenValidUntil = new Date(Date.now() + 60 * 60 * 1000);
  await session.save();

  res.json({
    status: 200,
    message: "User updated successfully",
    user: req.user,
    accessToken: session.accessToken
  });
};
