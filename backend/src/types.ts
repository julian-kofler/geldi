import mysql from "mysql2/promise";

export interface SignUpResponse {
    message: string;
    jwt: string;
}

export interface User extends mysql.RowDataPacket{
    id: number;
    email: string;
    password: string;
    nickname: string;
    profilePicPath?: string;
}

export interface PasswordReset extends mysql.RowDataPacket{
    id: number;
    token: string;
    expirationTime: Date;
}