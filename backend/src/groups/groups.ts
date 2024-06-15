import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import crypto from "crypto";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zxcvbn from 'zxcvbn';

import { User, } from '../user/types';
import { Group } from './types'
import { json } from "stream/consumers";


export class GroupManagement {
    private db: mysql.Connection;

    public constructor(db: mysql.Connection) {
        this.db = db;
    }
    async getGroups(userID: number): Promise<{ statusCode: number, message: string, result: Group[] }> {
        try {
            const sqlQuery = "SELECT id, name, completed FROM  \`groups\` as g inner join members_in_groups as mg on g.id = mg.groupID where userID = ?";            
            const values = [userID];
            const [groups] = await this.db.execute<Group[]>(sqlQuery, values);
            return { statusCode: 200, message: "successful", result: groups};
        } catch (error) {
            console.error(error);
            return { statusCode: 500, message: "Internal server error", result: []};
        }
    }
    async createGroup(name: string, members: number[]): Promise<{ statusCode: number, message: string}> {
        try {
            const sqlQuery = "INSERT INTO \`groups\` (name, completed) VALUES (?, ?)";
            const values = [name, 0];
            const [result] = await this.db.execute<mysql.OkPacket>(sqlQuery, values);
            const groupID = result.insertId;            
            
            const sqlQuery2 = "INSERT INTO members_in_groups (groupID, userID) VALUES (?, ?)";
            for (let member of members) {
                const values2 = [groupID, member];
                await this.db.execute(sqlQuery2, values2);
            }
            return { statusCode: 200, message: "successful"};
        } catch (error) {
            console.error(error);
            return { statusCode: 500, message: "Internal server error",};
        }
    }
}

