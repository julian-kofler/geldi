import mysql from "mysql2/promise";

export interface IfUserSettings {
  nickname: string;
  email: string;
  password: string;
}

export interface User extends mysql.RowDataPacket {
  id: number;
  email: string;
  password: string;
  nickname: string;
  profilePicPath?: string;
}
