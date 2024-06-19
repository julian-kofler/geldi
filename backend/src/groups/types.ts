import mysql from "mysql2/promise";

export interface Group extends mysql.RowDataPacket {
  id: number;
  name: string;
  completed: number;
}
