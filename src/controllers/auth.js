import {  logoutUser, refreshUsersSession, requestResetToken } from "../services/auth.js";
import { resetPassword } from '../services/auth.js';

const setupSession = (res,session) => {

};

export const registerUserController = async (req,res)=>{


};


export const loginUserController = async (req, res) => {

};


export const logoutUserController = async (req,res) => {
  if(req.cookies.sessionId){
    await logoutUser(req.cookies.sessionId);
  };

};



export const refreshUserSessionController = async (req,res) => {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res,session);

};

export const requestResetEmailController = async (req,res)=> {
await requestResetToken(req.body.email);

};


export const resetPasswordController = async (req,res) => {
  await resetPassword(req.body);


};
