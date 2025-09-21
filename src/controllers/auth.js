import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestResetToken,
  resetPassword
} from "../services/auth.js";
import { ONE_DAY } from "../constants/index.js";

// Хелпер для встановлення сесійних cookie
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

// Реєстрація
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

// Логін
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
      sessionId: session._id,
    },
  });
};

// Логаут
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// Оновлення сесії
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

// Відправка email з reset-токеном
export const requestResetEmailController = async (req, res) => {
  const { resetToken } = await requestResetToken(req.body.email);

  // Тут можна додати email-розсилку
  res.status(200).json({
    status: 200,
    message: 'Reset token generated',
    data: { resetToken }
  });
};

// Скидання паролю
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password was reset successfully'
  });
};