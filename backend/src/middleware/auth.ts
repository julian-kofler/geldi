import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User } from "../user/types";
import { RequestWithUser } from "./types.js";
import { UserRepository } from "../user/userRepository.js";
import { db } from "../database.js";
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
      // check if token itself is valid
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          res.status(401).json({ message: "Token expired" });
        } else if (err instanceof jwt.NotBeforeError) {
          res.status(401).json({ message: "Token not active" });
        } else {
          logger.error((err as Error).message);
          res.status(401).json({ message: "Invalid token" });
        }
        return;
      }

      // check if payload is valid, set user in request if so
      try{
        if (payload && typeof payload == "object") {
          const userId = payload.userId;
          if (typeof userId === "number") {
            const user: User | null = await userRepo.getUserByID(userId);
            if (user){
              req.user = user;
              next();
              return;
            }
          }
        }
        res.status(401).json({ message: "Invalid token" });
      }
      catch(error){
        logger.error((error as Error).message);
        res.status(500).json({ message: "Invalid token" });
      }
    });
  } else {
    res.status(401).json({ message: "Authn header missing" });
  }
};

export function userIsDefined(
  req: RequestWithUser
): req is RequestWithUser & { user: User } {
  return req.user !== undefined;
}
