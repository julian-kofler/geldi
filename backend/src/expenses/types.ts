import mysql from "mysql2/promise";

export interface Expense extends mysql.RowDataPacket {
  id: number;
  groupId: number;
  title: string;
  amount: number;
  payedBy: number;
  timestamp: Date;
  tagId?: number;
  picPath?: string;
}

export interface ExpenseParams {
  id?: number;
  groupId: number;
  title: string;
  amount: number; //wrong, type is string
  timestamp: Date;
  payedBy: number;
  payedFor: number[];
  tagId?: number;
  picPath?: string;
}
export interface CompensationPayment {
  by: number,
  to: number,
  amount: number,
}