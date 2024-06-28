import mysql, { RowDataPacket } from "mysql2/promise";

import { Group, GroupParams, GroupResponse } from "./types";
import { logger } from "../middleware/global.js";
import { UserRepository } from "../user/userRepository.js";
import { User } from "../user/types";

export class GroupManagement {
  private db: mysql.Connection;
  private UserRepo: UserRepository;

  public constructor(db: mysql.Connection) {
    this.db = db;
    this.UserRepo = new UserRepository(db);
  }

  private isValidGroup(group: GroupParams) {
    if (!group || !group.name || !group.memberEmails) {
      return false;
    } 
    else if (group.name.length < 1 || group.memberEmails.length < 1) {
      return false;
    }
    return true;
  }

  private async inviteMember(email: string, groupID: number): Promise<void> {
    // TODO: Send an invite email
  }

  private async addMember(email: string, groupID: number): Promise<void> {
    try {
      let user: User | null = await this.UserRepo.getUserByEmail(email);
      if (!user) {
        this.inviteMember(email, groupID);
        return;
      }

      const sqlQuery2 =
        "INSERT INTO members_in_groups (groupID, userID) VALUES (?, ?)";
      const values = [groupID, user.id];
      await this.db.execute(sqlQuery2, values);
    } 
    catch (error) {
      throw error;
    }
  }

  public async getGroups(userID: number): Promise<{ statusCode: number; result: GroupResponse[] }> {
    try {
      const sqlQuery = `SELECT g.id, g.name, g.completed
        FROM \`groups\` g
        INNER JOIN members_in_groups mig ON g.id = mig.groupId
        LEFT JOIN (SELECT MAX(timestamp) as maxTimestamp, groupId from expenses e GROUP BY groupId)
        AS sub ON g.id = sub.groupId
        WHERE mig.userId = ?
        ORDER BY sub.maxTimestamp DESC;`;
      const [groups] = await this.db.execute<Group[]>(sqlQuery, [userID]);
  
      console.log(groups);
      const result: GroupResponse[] = [];
  
      for (let group of groups) {
        const sqlQuery2 =
          "SELECT userId, nickname, email FROM members_in_groups mig inner join users u on mig.userId = u.id WHERE groupID = ?";
        const [rows] = await this.db.execute<RowDataPacket[]>(sqlQuery2, [group.id]);
        // Cast rows to Member[] type
        const members: String[] = rows as unknown as String[];
        group.members = members;
  
        result.push(group as GroupResponse);
      }
  
      return { statusCode: 200, result };
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, result: [] };
    }
  }

  public async getGroup(groupID: number): Promise<{ statusCode: number; result: GroupResponse | null }> {
    try {
      const sqlQuery = "SELECT * FROM `groups` WHERE id = ?";
      const [groups] = await this.db.execute<Group[]>(sqlQuery, [groupID]);

      if (groups.length === 0) {
        return { statusCode: 404, result: null };
      }

      const sqlQuery2 =
        "SELECT userId, nickname, email FROM members_in_groups mig inner join users u on mig.userId = u.id WHERE groupID = ?";
      const [rows] = await this.db.execute<RowDataPacket[]>(sqlQuery2, [groupID]);
      // Cast rows to Member[] type
      const members: String[] = rows as unknown as String[];
      groups[0].members = members;

      return { statusCode: 200, result: groups[0] as GroupResponse };
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, result: null };
    }
  }

  public async createGroup(group: GroupParams, creator: User): Promise<{ statusCode: number; message: string }> {
    if(!this.isValidGroup(group)) {
      return { statusCode: 400, message: "Invalid input" };
    }
    
    try {
      const sqlQuery = "INSERT INTO `groups` (name, completed) VALUES (?, ?)";
      const values = [group.name, false];
      const [result] = await this.db.execute<mysql.OkPacket>(sqlQuery, values);
      const groupID = result.insertId;

      await this.addMember(creator.email, groupID);
      for (let memberEmail of group.memberEmails) {
        await this.addMember(memberEmail, groupID);
      }

      return { statusCode: 200, message: "Group creation successful" };
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, message: "Internal server error" };
    }
  }

  public async editGroup(group: GroupParams): Promise<{ statusCode: number; message: string }> {
    if(!this.isValidGroup(group) || !group.id) {
      return { statusCode: 400, message: "Invalid input" };
    }
    
    try {
      const sqlQuery = "UPDATE `groups` SET name = ?, completed = ? WHERE id = ?";
      const values = [group.name, group.completed, group.id];
      await this.db.execute(sqlQuery, values);

      const sqlQuery2 = "DELETE FROM members_in_groups WHERE groupID = ?";
      await this.db.execute(sqlQuery2, group.id);

      for (let memberEmail of group.memberEmails) {
        await this.addMember(memberEmail, group.id);
      }

      return { statusCode: 200, message: "Group updated successfully" };
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, message: "Internal server error" };
    }
  }

  public async deleteGroup(groupID: number): Promise<{ statusCode: number; message: string }> {
    try {
      const sqlQuery = "DELETE FROM members_in_groups WHERE groupID = ?";
      await this.db.execute(sqlQuery, groupID);

      const sqlQuery2 = "DELETE FROM `groups` WHERE id = ?";
      await this.db.execute(sqlQuery2, groupID);
      return { statusCode: 200, message: "Group deleted successfully" };
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, message: "Internal server error" };
    }
  }
}
