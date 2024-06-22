import mysql from "mysql2/promise";

import { Expense, ExpenseParams } from "./types";
import { logger } from "../middleware/global.js"

export class ExpenseManagement {
  private db: mysql.Connection;

  public constructor(db: mysql.Connection) {
    this.db = db;
  }

  private isValidExpense(expense: ExpenseParams){
    if (!expense || !expense.amount || !expense.title || !expense.payedBy || !expense.groupId || !expense.payedFor || !expense.timestamp){
        return false;
    }
    else if (expense.amount < 0 || expense.title.length < 1 || expense.payedBy < 1 || expense.groupId < 1 || expense.payedFor.length < 1){
        return false;
    }
    return true;
  }

  public async createExpense(expense: ExpenseParams): Promise<{ statusCode: number; message: string }> {
    if(!this.isValidExpense(expense)){
      return { statusCode: 400, message: "Invalid input" };
    }
    if(!expense.picPath){
      expense.picPath = "";
    }
    let tagId = expense.tagId || null;

    try {
      const sql = "INSERT INTO expenses (groupId, title, amount, timestamp, payedBy, tagId, picPath) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [expense.groupId, expense.title, expense.amount, expense.timestamp, expense.payedBy, tagId, expense.picPath];
      const response = await this.db.execute<mysql.OkPacket>(sql, values);
      const expenseID = response[0].insertId;

      for (const userID of expense.payedFor) {
        const sql = "INSERT INTO payed_for (expenseID, userID) VALUES (?, ?)";
        const values = [expenseID, userID];
        await this.db.execute<Expense[]>(sql, values);
      }
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, message: "Internal server error" };
    }
    return { statusCode: 200, message: "Expense creation successful" };
  }

  public async editExpense(expense: ExpenseParams): Promise<{ statusCode: number; message: string }> {
    if(!this.isValidExpense(expense)){
      return { statusCode: 400, message: "Invalid input" };
    }

    try {
      const sql = "UPDATE expenses SET groupId = ?, title = ?, amount = ?, timestamp = ?, payedBy = ?, tagId = ?, picPath = ? WHERE id = ?";
      const values = [expense.groupId, expense.title, expense.amount, expense.timestamp, expense.payedBy, expense.tagId, expense.picPath, expense.id];
      await this.db.execute<mysql.OkPacket>(sql, values);

      const sql2 = "DELETE FROM payed_for WHERE expenseID = ?";
      await this.db.execute<mysql.OkPacket>(sql2, [expense.id]);

      for (const userID of expense.payedFor) {
        const sql = "INSERT INTO payed_for (expenseID, userID) VALUES (?, ?)";
        const values = [expense.id, userID];
        await this.db.execute<Expense[]>(sql, values);
      }
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, message: "Internal server error" };
    }
    return { statusCode: 200, message: "Expense edited successfully" };
  }

  public async getExpenses(groupId: number): Promise<{ statusCode: number; result: Expense[] }> {
    try {
      console.log("GroupID: " + groupId);
      const sql = "SELECT * FROM expenses WHERE groupId = ?";
      const [expenses] = await this.db.execute<Expense[]>(sql, [groupId]);
      return { statusCode: 200, result: expenses };
    } catch (error) {
      logger.error((error as Error).message)
      return { statusCode: 500, result: [] };
    }
  }

  public async deleteExpense(expenseID: number): Promise<{ statusCode: number; message: string }> {
    try {
      const sql = "DELETE FROM payed_for WHERE expenseID = ?";
      await this.db.execute<mysql.OkPacket>(sql, [expenseID]);

      const sql2 = "DELETE FROM expenses WHERE id = ?";
      await this.db.execute<mysql.OkPacket>(sql2, [expenseID]);
      return { statusCode: 200, message: "Expense deleted successfully" };
    } 
    catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, message: "Internal server error" };
    }
  }
}
