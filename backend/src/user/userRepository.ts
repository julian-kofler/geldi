import mysql from "mysql2/promise";

import { User } from "./types";

export class UserRepository{
    private db: mysql.Connection;

    constructor(db: mysql.Connection) {
        this.db = db;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        try {
            const sql = "SELECT * FROM users WHERE email = ?";
            const [rows] = await this.db.query<User[]>(sql, [email]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }            
        } catch (error) {
            console.error((error as Error).message);
            throw error;
        }
    }

    public async getUserByID(id: number): Promise<User | null> {
        try {
            const sql = "SELECT * FROM users WHERE id = ?";
            const [rows] = await this.db.query<User[]>(sql, [id]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }            
        } catch (error) {
            console.error((error as Error).message);
            throw error;
        }
    }
}

