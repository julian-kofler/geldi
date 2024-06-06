import mysql from "mysql2/promise";

export interface Expense extends mysql.RowDataPacket{
    id: number;
    groupId: number;
    payedBy: number;
    title: string;
    amount: number;
    timestamp: Date;
    tagId: number;
    picPath?: string;
}