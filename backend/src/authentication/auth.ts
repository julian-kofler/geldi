import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cron from "node-cron";
import CryptoES from "crypto-es";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zxcvbn from 'zxcvbn';

import { SignUpResponse, jwtRefreshResponse, refreshTokenResponse, User, PasswordReset, ValidRefreshToken } from './types';

export class Auth {
    private db: mysql.Connection;
    private emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private resetTokenValidityTime: number = 30; // Token is valid for 30 minutes
    private resetTokenExpirationTime: Date = new Date();
    private refreshTokenValidityTime: number = 60 * 24 * 10; // Token is valid for 10 days
    private refreshTokenExpirationTime: Date = new Date();
    private jwtValidityTime: string = "5min";
    private commonPasswordsURL: string = "https://lucidar.me/en/security/files/100000-most-common-passwords.json";
    private commonPasswordsPath: string = "";

    public constructor(db: mysql.Connection){
        this.db = db;
        try{
            this.scheduleAutomaticTasks();
            this.commonPasswordsPath = path.join(fileURLToPath(import.meta.url), '../../../data/' + this.commonPasswordsURL.split('/').pop()!);    
            if(!fs.existsSync(this.commonPasswordsPath)){
                this.fetchCommonPasswords();
            }
            if(!fs.existsSync(this.commonPasswordsPath)){
                throw new Error("Common passwords file not found");
            }
        }
        catch(error){
            console.error((error as Error).message);
        }
    }

    private scheduleAutomaticTasks(): void {
        cron.schedule('0 0 * * *', async () => {
            try {
                this.passwordResetCleanup;
                this.fetchCommonPasswords();
            } catch (error) {
                console.error((error as Error).message);
            }
        });
    }

    private async passwordResetCleanup(): Promise<void> {
        const sql = "DELETE FROM password_resets WHERE expirationTime < NOW()";
        await this.db.execute(sql);
    }

    private async fetchCommonPasswords(): Promise<void> {
        // Fetch the passwords from the API
        const response = await fetch(this.commonPasswordsURL);
        const commonPasswords = await response.json();

        // Save the passwords to a file
        fs.writeFileSync(this.commonPasswordsPath, JSON.stringify(commonPasswords));
    }

    private async isValidPassword(password: string): Promise<{valid:boolean, message:string}> {
        let message: string = "";
        let valid: boolean = true;

        if(!password){
            valid = false;
            message = "password is required";
        }
        else{
            const result = await this.isWeakPassword(password);
            if(!result.valid){
                valid = false;
                message = result.message;
            }
        }
        if(valid){
            const result = await this.isInCustomList(password);
            if(result){
                valid = false;
                message = "Password is too common";
            }
        }
        
        return {valid: valid, message: message};
    }

    private async isInCustomList(password: string): Promise<boolean> {
        const commonPasswords = JSON.parse(fs.readFileSync(this.commonPasswordsPath, 'utf8'));
        return commonPasswords.includes(password);
    }

    private async isWeakPassword(password: string): Promise<{valid: boolean, message: string}> {
        const result = zxcvbn(password);
        let message: string = "";

        if(result.score < 4){
            let feedback: string = result.feedback.suggestions.join(' ');
            let warning: string = result.feedback.warning;
            if (warning === "") warning = "Password is too weak";
            if (feedback === "") feedback = "Please choose a stronger password";
            message = warning + " | " + feedback;
            return {valid: false, message: message};
        }

        return {valid: true, message: ""};
    }

    private async isValidEmail(email: string): Promise<{valid:boolean, message:string}> {
        if(!email){
            return { valid: false, message: "email is required" };
        }
        else if(!this.emailRegex.test(email)){
            return { valid: false, message: "invalid email address" };
        }
        return { valid: true, message: "" };
    }

    private async getUserByEmail(email: string): Promise<User | null> {
        try {
            const sql = "SELECT * FROM users WHERE email = ?";
            const [rows] = await this.db.query<User[]>(sql, [email]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }            
        } catch (error) {
            console.error((error as Error).message);
            throw error;
        }
    }

    private async getUserByID(id: number): Promise<User | null> {
        try {
            const sql = "SELECT * FROM users WHERE id = ?";
            const [rows] = await this.db.query<User[]>(sql, [id]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }            
        } catch (error) {
            console.error((error as Error).message);
            throw error;
        }
    }

    private async getPasswordReset(hashedToken: string): Promise<PasswordReset | null> {
        try {
            const sql = "SELECT token, userId expirationTime FROM password_resets WHERE token = ?";
            const [rows] = await this.db.query<PasswordReset[]>(sql, [hashedToken]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }            
        } catch (error) {
            console.error((error as Error).message);
            throw error;
        }
    }

    private createJWT(userId: number): string {
        return jwt.sign({ uID: userId }, process.env.JWT_SECRET!, { expiresIn: this.jwtValidityTime });
    }

    private async createRefreshToken(userId: number): Promise<string> {
        try{
            const refreshToken = crypto.randomBytes(64).toString('hex');

            // Hash the token
            const hashedRefreshToken = CryptoES.SHA3(refreshToken).toString();

            // Store the hashed token in your database along with the user's email and the token's expiration time
            this.refreshTokenExpirationTime = new Date();
            this.refreshTokenExpirationTime.setMinutes(this.refreshTokenExpirationTime.getMinutes() + this.refreshTokenValidityTime);

            const sqlDelete = "DELETE FROM validRefreshTokens WHERE userId = ?"; // delete all existing refresh tokens for the user
            await this.db.execute<User[]>(sqlDelete, [userId]);

            const sqlInsert = "INSERT INTO validRefreshTokens (token, userId, expirationTime) VALUES (?, ?, ?)";
            const values = [hashedRefreshToken, userId, this.refreshTokenExpirationTime];
            await this.db.execute<User[]>(sqlInsert, values);

            return refreshToken;

        } catch (error) {
            console.error((error as Error).message);
            throw error;
        }
    }

    private async getValidRefreshToken(hashedToken: string): Promise<ValidRefreshToken | null> {
        try {
            const sql = "SELECT token, userId, expirationTime FROM validRefreshTokens WHERE token = ?";
            const [rows] = await this.db.query<ValidRefreshToken[]>(sql, [hashedToken]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }            
        } catch (error) {
            console.error((error as Error).message);
            throw error;
        }
    }

    private async isRefreshTokenValid(token: string): Promise<boolean> {
        const hashedToken = CryptoES.SHA3(token).toString();
        const validToken = await this.getValidRefreshToken(hashedToken);
        if (!validToken) {
            return false;
        }
        if (new Date() > validToken.expirationTime) {
            return false;
        }
        return true;
    }

    private async getUserIdFromRefreshToken(token: string): Promise<number | null> {
        const hashedToken = CryptoES.SHA3(token).toString();
        const validToken = await this.getValidRefreshToken(hashedToken);
        if (!validToken) {
            return null;
        }
        return validToken.userId;
    }

    private async invalidateRefreshToken(userId: number): Promise<{ statusCode: number, message: string }> {
        try {
            const sql = "DELETE FROM validRefreshTokens WHERE userID = ?";
            await this.db.execute<User[]>(sql, [userId]);
            return { statusCode: 200, message: "Refresh token invalidated successfully" };
        } catch (error) {
            console.error((error as Error).message);
            return { statusCode: 500, message: "Error invalidating refresh token" };
        }
    }

    public async verifyJWT(token: string): Promise<number | null> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { uID: number };
            return decoded.uID;
        } catch (error) {
            console.error((error as Error).message);
            return null;
        }
    }

    public async refreshJWT(token: string): Promise<{ statusCode: number, result: jwtRefreshResponse }> {
        try {
            if (!this.isRefreshTokenValid(token)) {
                return { statusCode: 401, result: { message: "Invalid refresh token", jwt: ""} };
            }
    
            const userId = await this.getUserIdFromRefreshToken(token);
            if (!userId) {
                return { statusCode: 401, result: { message: "Invalid refresh token", jwt: ""} };
            }
    
            const newToken = this.createJWT(userId);
            return { statusCode: 200, result: { message: "Token refreshed successfully", jwt: newToken} };
        } catch (error) {
            console.error((error as Error).message);
            return { statusCode: 500, result: { message: "Error refreshing token", jwt: ""} };
        }
    }

    public async newRefreshToken(token: string): Promise<{ statusCode: number, result: refreshTokenResponse }> {
        try {
            if (!this.isRefreshTokenValid(token)) {
                return { statusCode: 401, result: { message: "Invalid refresh token", refreshToken: "" } };
            }
    
            const userId = await this.getUserIdFromRefreshToken(token);
            if (!userId) {
                return { statusCode: 401, result: { message: "Invalid refresh token", refreshToken: "" } };
            }
    
            const newToken = await this.createRefreshToken(userId);
            return { statusCode: 200, result: { message: "Refresh token refreshed successfully", refreshToken: newToken } };
        } catch (error) {
            console.error((error as Error).message);
            return { statusCode: 500, result: { message: "Error refreshing refresh token", refreshToken: "" } };
        }
    }

    public async signUp(email: string, password: string, nickname: string): Promise<{ statusCode: number, result: SignUpResponse }> {
        const emailCheck = await this.isValidEmail(email);
        const passwordCheck = await this.isValidPassword(password);

        if (!emailCheck.valid) {
            return { statusCode: 400, result: { message: emailCheck.message, jwt: "", refreshToken: "" } };
        }
        if (!passwordCheck.valid) {
            return { statusCode: 400, result: { message: passwordCheck.message, jwt: "", refreshToken: "" } };
        }
    
        try {
            const hash = await bcrypt.hash(password, 10);

            const sql = "INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)";
            const values = [email, hash, nickname];
            await this.db.execute<User[]>(sql, values);
            
            // get UserID, create JWT based on the ID
            const user: User|null = await this.getUserByEmail(email);
            const token = this.createJWT(user!.id);
            const refreshToken = await this.createRefreshToken(user!.id);
            return {statusCode: 200, result: { message: "User signup successful", jwt: token, refreshToken: refreshToken}};
        
        } catch (error) {
        console.error((error as Error).message);
        return { statusCode: 500, result: { message: "Error registering user", jwt: "", refreshToken: "" } };
        }
    }

    public async login(email: string, password: string): Promise<{ statusCode: number, result: SignUpResponse }> {
        try { 
            const user: User|null = await this.getUserByEmail(email);

            if (!user) {
                return { statusCode: 401, result: { message: "Incorrect credentials", jwt: "", refreshToken: "" } };
            }

            const match = await new Promise<boolean>((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
    
            if (!match) {
                return { statusCode: 401, result: { message: "Incorrect credentials", jwt: "", refreshToken: "" } };
            }
    
            const token = this.createJWT(user.id);
            const refreshToken = await this.createRefreshToken(user.id);
                
            return {statusCode: 200, result: { message: "User login successful", jwt: token, refreshToken: refreshToken}};
        } catch (error) {
            console.error((error as Error).message);
            return { statusCode: 500, result: { message: "Error logging in user", jwt: "", refreshToken: "" } };
        }
    }

    public async logout(refreshToken: string): Promise<{ statusCode: number, message: string }> {
        try {
            if(await this.isRefreshTokenValid(refreshToken)){
                const userId = await this.getUserIdFromRefreshToken(refreshToken);
                if (!userId) {
                    return { statusCode: 401, message: "Unauthorized" };
                }
                return await this.invalidateRefreshToken(userId);
            }
            return { statusCode: 401, message: "Unauthorized" };
        } catch (error) {
            console.error((error as Error).message);
            return { statusCode: 500, message: "Error logging out" };
        }
    }

    public async requestPasswordReset(email: string): Promise<{ statusCode: number, message: string }> {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                return { statusCode: 200, message: "If the account exists, the password reset email has been sent successfully" };
            } 

            // Generate a unique token
            const token = crypto.randomBytes(64).toString('hex');

            // Hash the token
            const hashedToken = CryptoES.SHA3(token).toString();

            // Store the hashed token in your database along with the user's email and the token's expiration time
            this.resetTokenExpirationTime = new Date();
            this.resetTokenExpirationTime.setMinutes(this.resetTokenExpirationTime.getMinutes() + this.resetTokenValidityTime);

            const sql = "INSERT INTO password_resets (token, userId, expirationTime) VALUES (?, ?, ?)";
            const values = [hashedToken, user.id, this.resetTokenExpirationTime];
            await this.db.execute<User[]>(sql, values);

            // Send an email to the user with a link to reset their password
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const resetUrl = `http://localhost:3000/reset/${token}`;

            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: 'Ausgabenverwaltung: Passwort zurücksetzen',
                text: `Sie erhalten diese E-Mail, weil Sie (oder jemand anderes) eine Zurücksetzung des Passworts für Ihr Konto angefordert haben.\n\n` +
                    `Bitte klicken Sie auf den folgenden Link oder fügen Sie ihn in Ihren Browser ein, um den Vorgang innerhalb von ${this.resetTokenValidityTime} Minuten abzuschließen:\n\n` +
                    `${resetUrl}\n\n` +
                    `Wenn Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail und Ihr Passwort bleibt unverändert.\n\n`
            };

            await transporter.sendMail(mailOptions);

            return { statusCode: 200, message: "If the account exists, the password reset email has been sent successfully" };
        } catch (error) {
            console.error((error as Error).message);
            return { statusCode: 500, message: "Error sending password reset email" };
        }
    }

    public async passwordReset(token: string, newPassword: string): Promise<{ statusCode: number, result: SignUpResponse }> {
        try{
            // Retrieve the hashed token and expiration time from the database
            const hashedRequestToken = CryptoES.SHA3(token).toString();
            const resetInfo: PasswordReset|null = await this.getPasswordReset(hashedRequestToken);

            if (!resetInfo) {
                throw new Error("Invalid token");
            }

            // Check if the token has expired
            if (new Date() > resetInfo.expirationTime) {
                throw new Error("Token has expired");
            }

            // Check if the new password meets the requirements
            const passwordCheck = await this.isValidPassword(newPassword);
            if (!passwordCheck.valid) {
                return { statusCode: 400, result: { message: passwordCheck.message, jwt: "", refreshToken: "" } };
            }
        
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
        
            // Update the user's password in the database
            await this.db.execute(
                "UPDATE users SET password = ? WHERE id = ?",
                [hashedPassword, resetInfo.id]
            );

            // Delete the password reset request from the database
            await this.db.execute(
                "DELETE FROM password_resets WHERE id = ?",
                [resetInfo.id]
            );
            
            const user: User|null = await this.getUserByID(resetInfo.id);
            return await this.login(user!.email, newPassword);
        }
        catch(error){
            console.error((error as Error).message);
            return { statusCode: 500, result: { message: "Error resetting password", jwt: "", refreshToken: "" } };
        }        
    }

    public async passwordUpdate(email: string, oldPassword: string, newPassword: string): Promise<{ statusCode: number, message: string }> {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                return { statusCode: 401, message: "Unauthorized" };
            } 

            const match = await new Promise<boolean>((resolve, reject) => {
                bcrypt.compare(oldPassword, user.password, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
    
            if (!match) {
                return { statusCode: 401, message: "Unauthorized" };
            }
    
            const hash = await bcrypt.hash(newPassword, 10);
        
            await this.db.execute(
                "UPDATE users SET password = ? WHERE email = ?",
                [hash, email]
            );
    
            return { statusCode: 200, message: "Password updated successfully" };
        } catch (error) {
            console.error((error as Error).message);
            return { statusCode: 500, message: "Error updating password" };
        }
    }
}
