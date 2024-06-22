import { Request } from "express";
import mysql from "mysql2/promise";

import { User } from "../user/types";

// new interface that extends the existing Request interface
export interface RequestWithUser extends Request {
  user?: User;
}

export interface membersInGroups extends mysql.RowDataPacket {
  userId: number;
  groupId: number;
}