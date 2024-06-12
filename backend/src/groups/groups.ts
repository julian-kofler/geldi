import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import crypto from "crypto";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zxcvbn from 'zxcvbn';

import { User, } from '../authentication/types';
import { Group } from './types'
import { json } from "stream/consumers";


export class GroupManagement {
    private db: mysql.Connection;

    public constructor(db: mysql.Connection) {
        this.db = db;
    }
    async getGroups(userID: number): Promise<{ statusCode: number, message: string, result: Group[] }> {
        try {
            console.log("userID: ", userID);

            const sqlQuery = "SELECT id, name, completed FROM  \`groups\` natural join members_in_groups where userID = ?";            
            const values = [userID];
            const [groups] = await this.db.execute<Group[]>(sqlQuery, values);
            return { statusCode: 200, message: "successful", result: groups};
        } catch (error) {
            console.error(error);
            return { statusCode: 500, message: "Internal server error", result: []};
        }
    }
}

