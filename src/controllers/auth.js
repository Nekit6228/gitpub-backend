import {  loginUser, logoutUser, refreshUsersSession, registerUser } from "../services/auth.js";
import { ONE_DAY } from "../constants/index.js";
import { verifySession } from "../middlewares/verifySession.js";

const setupSession = (res,session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const registerUserController = async (req,res)=>{
const user = await registerUser(req.body);

res.status(201).json({
        status: 201,
        massage: 'Successfully registered a user!',
        data:user,
    });
};




export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

   setupSession(res, session);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken
    },
  });
};


export const logoutUserController = async (req,res) => {
  if(req.cookies.sessionId){
    await logoutUser(req.cookies.sessionId);
  };

   res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};



export const refreshUserSessionController = async (req,res) => {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });
    setupSession(res,session);
    res.json({
        status: 200,
        massage:'Successfully refreshed a session!',
        data:{
          accessToken: session.accessToken,
        }
    });
};


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
    // Генеруємо новий accessToken
    const newAccessToken = session.generateAccessToken();
    // Встановлюємо новий accessToken у cookie
    res.cookie('accessToken', newAccessToken, {
      path: '/',
      maxAge: 60 * 60, // 1 година
      sameSite: 'lax',
    });
    // Повертаємо дані користувача (або просто статус)
    return res.status(200).json({
      message: 'Session is valid',
      user: session.user,
    });
  } catch (err) {
    console.error('Session check error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};







