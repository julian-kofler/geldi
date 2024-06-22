import mysql, { RowDataPacket } from "mysql2/promise";

import { Group, GroupParams } from "./types";
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

  public async getGroups(userID: number): Promise<{ statusCode: number; result: GroupParams[] }> {
    try {
      const sqlQuery =
        "SELECT id, name, completed FROM  `groups` as g inner join members_in_groups as mg on g.id = mg.groupID where userID = ?";
      const [groups] = await this.db.execute<Group[]>(sqlQuery, [userID]);
  
      const result: GroupParams[] = [];
  
      for (let group of groups) {
        const sqlQuery2 =
          "SELECT userId, nickname FROM members_in_groups as mig inner join users as u on mig.userId = u.id WHERE groupID = ?";
        const [rows] = await this.db.execute<RowDataPacket[]>(sqlQuery2, [group.id]);
        // Cast rows to Member[] type
        const members: String[] = rows as unknown as String[];
        group.members = members;
  
        result.push(group as GroupParams);
      }
  
      return { statusCode: 200, result };
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, result: [] };
    }
  }

  public async createGroup(group: GroupParams): Promise<{ statusCode: number; message: string }> {
    if(!this.isValidGroup(group)) {
      return { statusCode: 400, message: "Invalid input" };
    }
    
    try {
      const sqlQuery = "INSERT INTO `groups` (name, completed) VALUES (?, ?)";
      const values = [group.name, false];
      const [result] = await this.db.execute<mysql.OkPacket>(sqlQuery, values);
      const groupID = result.insertId;

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
