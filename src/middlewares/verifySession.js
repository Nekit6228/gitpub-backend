import { SessionsCollection } from '../db/models/session.js';
import { UserCollections } from '../db/models/user.js';

export const verifySession = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (!sessionId) {
      return res.status(401).json({ message: 'Сесія не знайдена' });
    }

    const session = await SessionsCollection.findById(sessionId);
    if (!session || session.accessTokenValidUntil < new Date()) {
      return res
        .status(401)
        .json({ message: 'Сесія недійсна або протермінована' });
    }

    if (!session.userId) {
      return res
        .status(403)
        .json({ message: 'Сесія не прив’язана до користувача' });
    }

    const user = await UserCollections.findById(session.userId);
    if (!user) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    console.log('Cесія створена');

    next();
  } catch (error) {
    console.error('Помилка перевірки сесії:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};
