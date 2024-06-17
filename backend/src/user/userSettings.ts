import mysql from "mysql2/promise";

import { User } from "./types";
import { IfUserSettings } from "./types";
import { InputValidation } from "../authentication/inputValidation.js";
import { logger } from "../middleware/global.js";

export class UserSetgns {
  private db: mysql.Connection;
  private inputVal: InputValidation;

  constructor(db: mysql.Connection) {
    this.db = db;
    this.inputVal = new InputValidation();
  }

  async updateSettings(
    userSettings: IfUserSettings,
    userId: number
  ): Promise<{ statusCode: number; result: any }> {
    const emailCheck = await this.inputVal.isValidEmail(userSettings.email);
    const passwordCheck = await this.inputVal.isValidPassword(
      userSettings.password
    );

    if (!emailCheck.valid) {
      return { statusCode: 400, result: { message: emailCheck.message } };
    }
    if (!passwordCheck.valid) {
      return { statusCode: 400, result: { message: passwordCheck.message } };
    }

    try {
      const sql =
        "UPDATE users SET nickname = ?, email = ?, password = ? WHERE id = ?";
      await this.db.query(sql, [
        userSettings.nickname,
        userSettings.email,
        userSettings.password,
        userId,
      ]);

      return {
        statusCode: 200,
        result: { message: "Settings updated successfully" },
      };
    } catch (error) {
      logger.error((error as Error).message);
      return {
        statusCode: 500,
        result: { message: "An error occurred while updating settings" },
      };
    }
  }

  async getSettings(
    userId: number
  ): Promise<{ statusCode: number; result: any }> {
    try {
      let settings: IfUserSettings;
      const sql = "SELECT nickname, email FROM users WHERE id = ?";
      const [rows] = await this.db.query<User[]>(sql, [userId]);
      if (rows.length > 0) {
        settings = rows[0];
      } else {
        throw new Error("User not found");
      }

      return { statusCode: 200, result: settings };
    } catch (error) {
      logger.error((error as Error).message);
      return {
        statusCode: 500,
        result: { message: "An error occurred while fetching settings" },
      };
    }
  }
}
