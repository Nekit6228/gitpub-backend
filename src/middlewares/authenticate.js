// src/middlewares/authenticate.js
import createHttpError from "http-errors";
import { SessionsCollection } from "../db/models/session.js";

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return next(createHttpError(401, "Please provide Authorization header"));
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return next(createHttpError(401, "Auth header should be of type Bearer"));
    }

    const session = await SessionsCollection.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, "Session not found"));
    }

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      return next(createHttpError(401, "Access token expired"));
    }

    // ⚠️ Тимчасово не тягнемо UsersCollection — ставимо тільки _id
    req.user = { _id: session.userId };

    next();
  } catch (err) {
    next(err);
  }
};
