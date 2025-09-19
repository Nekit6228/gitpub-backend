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

// Оновити дані та refresh session
export const updateUser = async (req, res) => {
  if (req.body.name) req.user.name = req.body.name;
  if (req.body.email) req.user.email = req.body.email;
  await req.user.save();

  // Оновити accessToken у session
  const session = await SessionsCollection.findOne({ userId: req.user._id });
  if (!session) return res.status(401).json({ error: "Session not found" });

  session.accessToken = generateAccessToken(req.user);
  session.accessTokenValidUntil = new Date(Date.now() + 60 * 60 * 1000); // +1 год
  await session.save();

  res.json({ user: req.user, accessToken: session.accessToken });
};