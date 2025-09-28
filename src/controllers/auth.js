import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';
// import { verifySession } from '../middlewares/verifySession.js';

const setupSession = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 1000, // 15 хвилин у мілісекундах курва
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
