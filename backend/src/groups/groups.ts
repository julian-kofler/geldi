import mysql, { RowDataPacket } from "mysql2/promise";

import { Group } from "./types";
import { logger } from "../middleware/global.js";
import { UserSetgns } from "../user/userSettings.js";
import { User } from "../user/types";

export class GroupManagement {
  private db: mysql.Connection;
  private userSetgns: UserSetgns;

  public constructor(db: mysql.Connection) {
    this.db = db;
    this.userSetgns = new UserSetgns(db);
  }

  public async getGroups(userID: number): Promise<{ statusCode: number; result: Group[] }> {
    try {
      const sqlQuery =
        "SELECT id, name, completed FROM  `groups` as g inner join members_in_groups as mg on g.id = mg.groupID where userID = ?";
      const [groups] = await this.db.execute<Group[]>(sqlQuery, [userID]);
      return { statusCode: 200, result: groups };
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, result: [] };
    }
  }

  public async createGroup(name: string, members: number[]): Promise<{ statusCode: number; message: string }> {
    try {
      const sqlQuery = "INSERT INTO `groups` (name, completed) VALUES (?, ?)";
      const values = [name, false];
      const [result] = await this.db.execute<mysql.OkPacket>(sqlQuery, values);
      const groupID = result.insertId;

      const sqlQuery2 =
        "INSERT INTO members_in_groups (groupID, userID) VALUES (?, ?)";
      for (let member of members) {
        const values2 = [groupID, member];
        await this.db.execute(sqlQuery2, values2);
      }
      return { statusCode: 200, message: "Group creation successful" };
    } 
    catch (error) {
      logger.error(error);
      return { statusCode: 500, message: "Internal server error" };
    }
  }

  public async getMembers(groupID: number): Promise<{ statusCode: number; result: String[] }> {
    try {
      const sqlQuery =
        "SELECT userId, nickname FROM members_in_groups as mig inner join users as u on mig.userId = u.id WHERE groupID = ?";
      const [rows] = await this.db.execute<RowDataPacket[]>(sqlQuery, groupID);
      // Cast rows to Member[] type
      const members: String[] = rows as unknown as String[];
      return { statusCode: 200, result: members };
    } 
    catch (error) {
      logger.error(error);
      return { statusCode: 500, result: [] };
    }
  }

  public async inviteMember(email: string, groupID: number): Promise<{ statusCode: number; message: string }> {
    try {
      let user: User = (await this.userSetgns.getUserByEmail(email)).result;
      if (!user) {
        // TODO: Send an invite email
        return { statusCode: 404, message: "User not found" };
      }

      const sqlQuery2 =
        "INSERT INTO members_in_groups (groupID, userID) VALUES (?, ?)";
      const values = [groupID, user.id];
      await this.db.execute(sqlQuery2, values);
      return { statusCode: 200, message: "User added successfully" };
    } 
    catch (error) {
      logger.error(error);
      return { statusCode: 500, message: "Internal server error" };
    }
  }
}
