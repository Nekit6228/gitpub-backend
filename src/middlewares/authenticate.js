import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UserCollections } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {

  const token = req.cookies.accessToken;

  if (!token) {
    return next(createHttpError(401, 'Access token missing in cookies'));
  }


  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }


  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }


  const user = await UserCollections.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
