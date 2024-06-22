import winston from "winston";
import { Response, NextFunction } from "express";

import { membersInGroups } from "./types";
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
    let groupId;
    if (req.method === 'GET') {
      groupId = req.query.groupId as string;
    } 
    else if (req.method === 'POST' || req.method === 'PUT') {
      groupId = req.body.groupId;
    } 
    else if (req.method === 'DELETE') {
      groupId = req.params.groupId;
    }
    const userID = req.user.id;

    try{
      const sql = 'SELECT * FROM members_in_groups WHERE userId = ? AND groupId = ?';
      const values = [userID, groupId];
      const rows = await database.execute<membersInGroups[]>(sql, values);

      if (rows[0].length != 0) {
          next();
      } 
      else {
          logger.warn(`Possible adversary: User ${userID} tried to access group ${groupId} but is no member`);
          res.status(403).json({ message: "User is not a member of the specified group." });
      }
    }
    catch(error){
      logger.error((error as Error).message);
      res.status(500).json({ message: "Internal server error" });
    }    
  }  
}