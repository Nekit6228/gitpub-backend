import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { UserCollections } from '../db/models/user.js';

import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { updateUser } from '../services/users.js';
import { updateUserSchema } from '../validation/user.js';

// Отримати поточного користувача

export const getMeController = async (req, res) => {
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

// Оновлюємо комплексно

export const patchUserController = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Валідація тіла запиту
    const { error, value } = updateUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((d) => d.message) });
    }

    // Обробка фото
    const avatar = req.file;
    let photoUrl;

    if (avatar) {
      photoUrl =
        getEnvVar('ENABLE_CLOUDINARY') === 'true'
          ? await saveFileToCloudinary(avatar)
          : await saveFileToUploadDir(avatar);
    }

    const updateData = { ...value };
    if (photoUrl) updateData.avatar = photoUrl;

    // Уникнення порожнього pregnancy
    if (
      updateData.pregnancy &&
      Object.keys(updateData.pregnancy).length === 0
    ) {
      delete updateData.pregnancy;
    }

    const updatedUser = await updateUser(userId, updateData);

    if (!updatedUser) {
      return next(createHttpError(404, 'User not found'));
    }

    res.json({
      status: 200,
      message: 'Successfully patched a user!',
      data: updatedUser,
    });
  } catch (error) {
    console.error('patchUser error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Оновити аватар через Cloudinary

export const updateAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Avatar file required' });

  // Завантаження у Cloudinary
  const avatarUrl = await saveFileToCloudinary(req.file);

  req.user.avatar = avatarUrl;
  await req.user.save();

  res.json({ avatar: avatarUrl });
};
