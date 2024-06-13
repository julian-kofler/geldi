import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import crypto from "crypto";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zxcvbn from 'zxcvbn';

import { User, } from '../user/types';
import { Expense } from './types'
import { json } from "stream/consumers";

export class ExpenseManagement {
    private db: mysql.Connection;

    public constructor(db: mysql.Connection) {
        this.db = db;
    }

    async createExpense(groupId: number, title: string, amount: string, date: string, payedBy: string, payedFor: string): Promise<{ statusCode: number, message: string }> {
        // TODO: Validate the data
        if (!title || !amount || !date || !payedBy || !payedFor) {
            throw new Error('Missing required fields');
        }
        try {
            const sql = "INSERT INTO expenses (groupId, title, amount, timestamp, payedBy) VALUES (?, ?, ?, ?, ?)";
            const values = [groupId, title, amount, new Date(date).toISOString().slice(0, 19).replace('T', ' '), payedBy];
            const [result] = await this.db.execute<mysql.OkPacket>(sql, values);
            const expenseID = result.insertId;

            for (const userID of payedFor) {
                const sql = "INSERT INTO payed_for (expenseID, userID) VALUES (?, ?)";
                const values = [expenseID, userID];
                await this.db.execute<Expense[]>(sql, values);
            }
        } catch (error) {
            return { statusCode: 500, message: "Internal server error" };
        }
        return { statusCode: 200, message: "successful" };
    }
    async getExpenses(groupId: number): Promise<{ statusCode: number, message: string, result: Expense[] }> {
        try {
            const sql = "SELECT * FROM expenses WHERE groupId = ?";
            const values = [groupId];
            const [expenses] = await this.db.execute<Expense[]>(sql, values);
            return { statusCode: 200, message: "successful", result: expenses };
        } catch (error) {
            console.error(error);
            return { statusCode: 500, message: "Internal server error", result: [] };
        }
    }
}