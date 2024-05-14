import mysql from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config();
let connection = null;
export async function getConnection() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            rowsAsArray: false,
        });
    }
    return connection;
}
