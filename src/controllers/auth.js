import {  loginUser, logoutUser, refreshUsersSession, registerUser } from "../services/auth.js";
import { ONE_DAY, ONE_HOUR } from "../constants/index.js";
import { verifySession } from "../middlewares/verifySession.js";

const setupSession = (res,session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure:true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    sameSite: 'none',
    secure:true,
    expires: new Date(Date.now() + ONE_DAY),
  });
   res.cookie('accessToken', session.accessToken, {
    httpOnly: false, // Должно быть доступно клиенту
    sameSite: 'none',
    secure: true,
    expires: new Date(Date.now() + ONE_HOUR), // Срок жизни access токена (например, 1 час)
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

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
  });
};


export const logoutUserController = async (req,res) => {
  if(req.cookies.sessionId){
    await logoutUser(req.cookies.sessionId);
  };

   res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

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
    });
};










