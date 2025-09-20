import {  loginUser, logoutUser, refreshUsersSession, registerUser, requestResetToken } from "../services/auth.js";
import { resetPassword } from '../services/auth.js';
import { ONE_DAY } from "../constants/index.js";

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

  setupSession(res,session);

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
      accessToken: session.accessToken,
       sessionId: session._id,
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

export const requestResetEmailController = async (req,res)=> {
await requestResetToken(req.body.email);

};


export const resetPasswordController = async (req,res) => {
  await resetPassword(req.body);


};
