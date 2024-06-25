import mysql from "mysql2/promise";

export interface Group extends mysql.RowDataPacket {
  id: number;
  name: string;
  completed: number;
}

export interface GroupParams {
  id?: number;
  name: string;
  completed?: number;
  memberEmails: string[];
}

export interface GroupMember {
  id: number;
  nickname: string;
}

export interface GroupResponse {
  id: number;
  name: string;
  completed: number;
  members: GroupMember[];
}