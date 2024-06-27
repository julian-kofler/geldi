import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2/promise";

import { Expense, ExpenseParams, CompensationPayment } from "./types";
import { logger } from "../middleware/global.js"
import exp from "constants";
import { GroupManagement } from "../groups/groups.js";
import { db } from "../database.js";
const groupMgmt = new GroupManagement(await db);
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
      const date = new Date(expense.timestamp);
      const sql = "INSERT INTO expenses (groupId, title, amount, timestamp, payedBy, tagId, picPath) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [expense.groupId, expense.title, expense.amount, date, expense.payedBy, tagId, expense.picPath];
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
      const date = new Date(expense.timestamp);
      const values = [expense.groupId, expense.title, expense.amount, date, expense.payedBy, expense.tagId, expense.picPath, expense.id];
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

  public async getExpenses(groupId: number): Promise<{ statusCode: number; result: ExpenseParams[] }> {
    try {
      let expensesWithPayedFor: ExpenseParams[] = [];

      const sql = "SELECT * FROM expenses WHERE groupId = ?";
      const [expenses] = await this.db.execute<Expense[]>(sql, [groupId]);

      for (const expense of expenses) {
        const sql2 = "SELECT userID FROM payed_for WHERE expenseID = ?";
        const [payedFor] = await this.db.execute<RowDataPacket[]>(sql2, [expense.id]);

        let expenseParams: ExpenseParams = {
          ...expense,
          payedFor: payedFor.map((row) => row.userID),
        };
        expensesWithPayedFor.push(expenseParams);
      }
      return { statusCode: 200, result: expensesWithPayedFor };
    } 
    catch (error) {
      logger.error((error as Error).message)
      return { statusCode: 500, result: [] };
    }
  }

  public async getExpense(expenseID: number): Promise<{ statusCode: number; result: ExpenseParams | null }> {
    try {
      if (expenseID === undefined) {
        return { statusCode: 400, result: null }; // Bad Request if expenseID is undefined
      }
      let expenseParams: ExpenseParams;

      const sql = "SELECT * FROM expenses WHERE id = ?";
      const [expenses] = await this.db.execute<Expense[]>(sql, [expenseID]);

      const sql2 = "SELECT userID FROM payed_for WHERE expenseID = ?";
      const [payedFor] = await this.db.execute<RowDataPacket[]>(sql2, [expenseID]);

      expenseParams = {
        ...expenses[0],
        payedFor: payedFor.map((row) => row.userID),
      };

      return { statusCode: 200, result: expenseParams };
    } 
    catch (error) {
      logger.error((error as Error).message)
      return { statusCode: 500, result: null };
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
  public async total_cost(
    groupId: number
  ): Promise<{ statusCode: number; result: number }> {
    try {
      if (groupId === undefined) {
        return { statusCode: 400, result: 0 };
      }
      const res = await this.getExpenses(groupId);
      if (res.statusCode !== 200) {
        return { statusCode: 500, result: 0 };
      }
      const expenses = res.result

      let total_cost = 0;
      for(const expense of expenses){
        total_cost += parseFloat(expense.amount as unknown as string);
      }

      return { statusCode: 200, result: total_cost };
    } catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, result: 0 };
    }
  }
  public async my_cost(
    groupId: number,
    myUserID: number,
  ): Promise<{ statusCode: number; result: number }> {
    try {
      if (groupId === undefined) {
        return { statusCode: 400, result: 0 };
      }
      const res = await this.getExpenses(groupId);
      if (res.statusCode !== 200) {
        return { statusCode: 500, result: 0 };
      }
      const expenses = res.result
      let my_cost = 0;

      for(const expense of expenses){
        if(expense.payedFor.includes(myUserID)){
          my_cost += parseFloat(expense.amount as unknown as string) / expense.payedFor.length;
        }
      }
      return { statusCode: 200, result: my_cost };
    } catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, result: 0 };
    }
  }
  public async my_saldo(
    groupId: number,
    myUserID: number,
  ): Promise<{ statusCode: number; result: number }> {
    try {
      if (groupId === undefined) {
        return { statusCode: 400, result: 0 };
      }

      const res_expenses = await this.getExpenses(groupId);
      if (res_expenses.statusCode !== 200) {
        return { statusCode: 500, result: 0 };
      }
      const expenses = res_expenses.result

      const res_my_cost = await this.my_cost(groupId, myUserID);
      if (res_my_cost.statusCode !== 200) {
        return { statusCode: 500, result: 0 };
      }
      const my_cost = res_my_cost.result;

      let cost_spent_by_me = 0;
      for(const expense of expenses){
        if(expense.payedBy == myUserID){
          cost_spent_by_me += parseFloat(expense.amount as unknown as string);
        }
      }
      const my_saldo = cost_spent_by_me - my_cost;

      return { statusCode: 200, result: my_saldo };
    } catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, result: 0 };
    }
  } 
  public async compensation_payments(
    groupId: number,
  ): Promise<{ statusCode: number; result: CompensationPayment[] }> {
    try {
      if (groupId === undefined) {
        return { statusCode: 400, result: [] };
      }
      const res_members = await groupMgmt.getGroup(groupId);
      if (res_members.statusCode !== 200) {
        return { statusCode: 500, result: [] };
      }
      const members: number[] = res_members.result?.members.map((member: any) => member.userId) || [];

      type saldo = {
        userID: number,
        saldo: number,
      };
      let salden: saldo[] = [];
      for (const member of members){
        const res_saldo = await this.my_saldo(groupId, member);
        if (res_members.statusCode !== 200) {
          return { statusCode: 500, result: [] };
        }
        salden.push({
          userID: member,
          saldo: res_saldo.result,
        });
      }
      salden.sort((a, b) => a.saldo - b.saldo);

      let compensation_payments: CompensationPayment[] = [];

      for (let i = 0; i < members.length; i++) {
        if (salden[i].saldo < 0) { // -> user i muss etwas bezahlen
            let j = 0;
            let betrag = salden[i].saldo;
            while (salden[i].saldo < 0 && j < members.length) {
                betrag = salden[i].saldo * -1 < salden[j].saldo ? salden[i].saldo * -1 : salden[j].saldo;
                if (betrag > 0) {
                  compensation_payments.push(
                        {
                            by: salden[i].userID,
                            to: salden[j].userID,
                            amount: betrag,
                        }
                    );
                    salden[i].saldo += betrag;
                    salden[j].saldo -= betrag;
                }
                j++;
            }
        }
    }

      return { statusCode: 200, result: compensation_payments };
    } catch (error) {
      logger.error((error as Error).message);
      return { statusCode: 500, result:  []};
    }
  }
}
