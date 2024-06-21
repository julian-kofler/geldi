import winston from "winston";
import { Response, NextFunction } from "express";

import { RequestWithUser } from "./types";
import { userIsDefined } from "./auth.js";
import { db } from "../database.js";

const database = await db;

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combined.log" }),
  ],
});



export async function UserIsInGroup(req: RequestWithUser, res: Response, next: NextFunction) {
  if(userIsDefined(req)){
    const groupID = req.params.groupID;
    const userID = req.user.id;

    const sql = 'SELECT * FROM members_in_groups WHERE userId = ? AND groupId = ?';
    const values = [userID, groupID];
    const isMember = await database.query(sql, values);

    if (isMember.length > 0) {
        next();
    } 
    else {
        logger.warning(`Possible adversary: User ${userID} tried to access group ${groupID} but is no member`);
        res.status(403).json({ message: "User is not a member of the specified group." });
    }
  }  
}