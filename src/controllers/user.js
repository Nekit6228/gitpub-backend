import { SessionsCollection } from "../db/models/session.js";
import { generateAccessToken } from "../utils/token.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js"; // Додаємо Cloudinary утиліту
import { UserCollections } from "../db/models/user.js";

// Отримати поточного користувача
export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await UserCollections.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      ...user,
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
