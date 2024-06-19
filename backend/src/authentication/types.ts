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

export interface PasswordReset extends mysql.RowDataPacket {
  token: string;
  userId: number;
  expirationTime: Date;
}

export interface ValidRefreshToken extends mysql.RowDataPacket {
  token: string;
  userId: number;
  expirationTime: Date;
}
