import mysql from "mysql2/promise";

export interface SignUpResponse {
    message: string;
    jwt: string;
    refreshToken: string;
}

export interface jwtRefreshResponse {
    message: string;
    jwt: string;
}

export interface refreshTokenResponse {
    message: string;
    refreshToken: string;
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

export interface ValidRefreshToken extends mysql.RowDataPacket{
    token: string;
    userId: number;
    expirationTime: Date;
}