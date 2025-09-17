import createHttpError from "http-errors";
import { UserCollections } from "../db/models/user.js";
import bcrypt from 'bcrypt';
import { SessionsCollection } from "../db/models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { randomBytes } from 'crypto';

export const registerUser = async (payload) =>{
    const user = await UserCollections.findOne({email:payload.email});

    if (user) throw createHttpError("409","Email in use");

    const enxryptedPassord = await bcrypt.hash(payload.password,10);

    return await UserCollections.create({
        ...payload,
        password:enxryptedPassord,
    });
};


export const loginUser = async (payload) => {
    const user = await UserCollections.findOne({email: payload.email});

     if (!user) {
    throw createHttpError(401, 'User not Found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

   if (!isEqual) {
    throw createHttpError(401, 'Incorrect password');
  }



  await SessionsCollection.deleteOne({ userId: user._id });

   const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');


  const session = await SessionsCollection.create({
     userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return session;
};


export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};



export const refreshUsersSession = async ({sessionId,refreshToken}) => {

};


export const requestResetToken = async (email) => {

};


export const resetPassword = async (payload) =>{

};
