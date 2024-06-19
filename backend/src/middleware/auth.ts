import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User } from "../user/types";
import { RequestWithUser } from "./types.js";
import { UserRepository } from "../user/userRepository.js";
import { db } from "../database.js";
import { HttpError } from "./types.js";
import { logger } from "./global.js";

const userRepo = new UserRepository(await db);

export const loginRequired = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    logger.error("JWT_SECRET is not set");
    return res.sendStatus(500);
  }

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return next(new HttpError("Token expired", 401));
        } else if (err instanceof jwt.NotBeforeError) {
          throw new HttpError("Token not active", 401);
        } else {
          logger.error(err);
          return next(new HttpError("Invalid token", 401));
        }
      }

      if (typeof payload !== "string" && payload) {
        const userId = payload.userId;
        if (typeof userId === "number") {
          const user: User | null = await userRepo.getUserByID(userId);
          if (user) {
            req.user = user;
            next();
          } else {
            return next(new HttpError("Invalid token", 401));
          }
        } else {
          return next(new HttpError("Invalid token", 401));
        }
      } else {
        return next(new HttpError("Invalid token", 401));
      }
    });
  } else {
    return next(new HttpError("AuthHeader missing", 401));
  }
};

export function userIsDefined(
  req: RequestWithUser
): req is RequestWithUser & { user: User } {
  return req.user !== undefined;
}
