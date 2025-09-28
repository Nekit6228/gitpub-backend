import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';
import { verifySession } from '../middlewares/verifySession.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { loginOrSignupWithGoogle } from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 хвилин у мілісекундах курва
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 днів у мілісекундах курва
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 днів у мілісекундах курва
  });
};

export const registerUserController = async (req, res, next) => {
  try {
    const session = await registerUser(req.body);

    setupSession(res, session);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        accessToken: session.session.accessToken,
        refreshToken: session.session.refreshToken,
        sessionId: session.session.userId,
      },
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    next(err); // або res.status(err.status || 500).json({ error: err.message })
  }
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      sessionId: session.userId,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// export const checkSessionController = async (req, res) => {
//   try {
//     const { refreshToken, sessionId } = req.cookies;
//     if (!refreshToken || !sessionId) {
//       return res.status(401).json({ error: 'Missing session credentials' });
//     }
//     const session = await verifySession(refreshToken, sessionId);

//     if (!session || session.expired) {
//       return res.status(401).json({ error: 'Session expired or invalid' });
//     }
//     const newAccessToken = session.generateAccessToken();

//     // Встановлюємо новий accessToken у cookie
//     res.cookie('accessToken', newAccessToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//       path: '/',
//       maxAge: 30 * 60, // 15 хвилин
//     });
//     return res.status(200).json({
//       message: 'Session is valid',
//       user: session.user,
//     });
//   } catch (err) {
//     console.error('Session check error:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

export const checkSessionController = async (req, res) => {
  try {
    const { refreshToken, sessionId } = req.cookies;
    if (!refreshToken || !sessionId) {
      return res.status(401).json({ error: 'Missing session credentials' });
    }

    const session = await verifySession(refreshToken, sessionId);
    if (!session || session.expired) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    const newAccessToken = session.generateAccessToken();
    setupSession(res, { accessToken: newAccessToken, user: session.user });

    return res.status(200).json({
      message: 'Session is valid',
      user: session.user,
    });
  } catch (err) {
    console.error('Session check error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
