import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection: mysql.Connection | null = null;

export async function getConnection(database?: string): Promise<mysql.Connection> {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: database? database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      rowsAsArray: false,
    });
    await createTables(connection);
  }
  return connection;
}

async function createTables(connection: mysql.Connection): Promise<void> {
  await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            nickname VARCHAR(255) NOT NULL,
            profilePicPath VARCHAR(255)
        );
    `);

  await connection.query(`
        CREATE TABLE IF NOT EXISTS password_resets(
            token VARCHAR(255) PRIMARY KEY NOT NULL,
            userId INT NOT NULL,
            expirationTime TIMESTAMP NOT NULL,
            CONSTRAINT fk_pwUserId FOREIGN KEY (userId) REFERENCES users(id)
        );
    `);

  await connection.query(`
        CREATE TABLE IF NOT EXISTS validRefreshTokens(
            token VARCHAR(255) PRIMARY KEY NOT NULL,
            userId INT NOT NULL UNIQUE,
            expirationTime TIMESTAMP NOT NULL
        );
    `);

  await connection.query(`
        CREATE TABLE IF NOT EXISTS \`groups\`(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            completed BOOLEAN
        );
    `);

  await connection.query(`
        CREATE TABLE IF NOT EXISTS members_in_groups (
            userId INT NOT NULL,
            groupId INT NOT NULL,
            CONSTRAINT pk_membersInGroups PRIMARY KEY (userId, groupId),
            CONSTRAINT fk_membersUserID FOREIGN KEY (userId) REFERENCES users(id),
            CONSTRAINT fk_groupID FOREIGN KEY (groupId) REFERENCES \`groups\`(id)
        );
    `);

  await connection.query(`
        CREATE TABLE IF NOT EXISTS tags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
    `);

  await connection.query(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            groupId INT NOT NULL,
            payedBy INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(12,2) NOT NULL,
            \`timestamp\` TIMESTAMP NOT NULL,
            tagId INT,
            picPath VARCHAR(255),
            CONSTRAINT fk_payedBy FOREIGN KEY (payedBy) REFERENCES users(id),
            CONSTRAINT fk_group FOREIGN KEY (groupId) REFERENCES \`groups\`(id),
            CONSTRAINT fk_tag FOREIGN KEY (tagId) REFERENCES tags(id)
        );
    `);

  await connection.query(`
        CREATE TABLE IF NOT EXISTS payed_for (
            expenseID INT NOT NULL,
            userID INT NOT NULL,
            CONSTRAINT pk_payedFor PRIMARY KEY (expenseID, userID),
            CONSTRAINT fk_expenseID FOREIGN KEY (expenseID) REFERENCES expenses(id),
            CONSTRAINT fk_payedForUserID FOREIGN KEY (userID) REFERENCES users(id)
        );
    `);
}

export const db = getConnection();
