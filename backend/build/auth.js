import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cron from "node-cron";
import CryptoES from "crypto-es";
export class Auth {
    db;
    requiredPasswordLength = 12;
    emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    resetTokenValidityTime = 30; // Token is valid for 30 minutes
    resetTokenExpirationTime = new Date();
    constructor(db) {
        this.db = db;
        this.schedulePasswordResetCleanup();
    }
    schedulePasswordResetCleanup() {
        cron.schedule('0 0 * * *', async () => {
            try {
                const sql = "DELETE FROM password_resets WHERE expirationTime < NOW()";
                await this.db.execute(sql);
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    async isValidPassword(password) {
        if (!password) {
            return { valid: false, message: "password is required" };
        }
        else if (password.length < this.requiredPasswordLength) {
            return { valid: false, message: "password is too short (has to be at least " + this.requiredPasswordLength + " characters long)" };
        }
        return { valid: true, message: "" };
        // TODO: Check password against commonly used passwords
    }
    async isValidEmail(email) {
        if (!email) {
            return { valid: false, message: "email is required" };
        }
        else if (!this.emailRegex.test(email)) {
            return { valid: false, message: "invalid email address" };
        }
        return { valid: true, message: "" };
    }
    async getUserByEmail(email) {
        try {
            const sql = "SELECT * FROM users WHERE email = ?";
            const [rows] = await this.db.query(sql, [email]);
            if (rows.length > 0) {
                return rows[0];
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }
    async getUserByID(id) {
        try {
            const sql = "SELECT * FROM users WHERE id = ?";
            const [rows] = await this.db.query(sql, [id]);
            if (rows.length > 0) {
                return rows[0];
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }
    async getPasswordReset(hashedToken) {
        try {
            const sql = "SELECT id, token, expirationTime FROM password_resets WHERE token = ?";
            const [rows] = await this.db.query(sql, [hashedToken]);
            if (rows.length > 0) {
                return rows[0];
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }
    async signUp(email, password, nickname) {
        const emailCheck = await this.isValidEmail(email);
        const passwordCheck = await this.isValidPassword(password);
        if (!emailCheck.valid) {
            return { statusCode: 400, result: { message: emailCheck.message, jwt: "" } };
        }
        if (!passwordCheck.valid) {
            return { statusCode: 400, result: { message: passwordCheck.message, jwt: "" } };
        }
        try {
            const hash = await bcrypt.hash(password, 10);
            const sql = "INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)";
            const values = [email, hash, nickname];
            await this.db.execute(sql, values);
            // get UserID, create JWT based on the ID
            const user = await this.getUserByEmail(email);
            const token = jwt.sign({ uID: Number(user.id) }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { statusCode: 200, result: { message: "User registered successfully", jwt: token } };
        }
        catch (error) {
            console.error(error.message);
            return { statusCode: 500, result: { message: "Error registering user", jwt: "" } };
        }
    }
    async login(email, password) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                return { statusCode: 401, result: { message: "Incorrect credentials", jwt: "" } };
            }
            const match = await new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            if (!match) {
                return { statusCode: 401, result: { message: "Incorrect credentials", jwt: "" } };
            }
            const token = jwt.sign({ uID: Number(user.id) }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { statusCode: 200, result: { message: "User successfully logged in", jwt: token } };
        }
        catch (error) {
            console.error(error.message);
            return { statusCode: 500, result: { message: "Error logging in user", jwt: "" } };
        }
    }
    async requestPasswordReset(email) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                return { statusCode: 200, message: "If the account exists, the password reset email has been sent successfully" };
            }
            // Generate a unique token
            const token = crypto.randomBytes(20).toString('hex');
            // Hash the token
            const hashedToken = CryptoES.SHA3(token).toString();
            // Store the hashed token in your database along with the user's email and the token's expiration time
            this.resetTokenExpirationTime = new Date();
            this.resetTokenExpirationTime.setMinutes(this.resetTokenExpirationTime.getMinutes() + this.resetTokenValidityTime);
            const sql = "INSERT INTO password_resets (id, token, expirationTime) VALUES (?, ?, ?)";
            const values = [user.id, hashedToken, this.resetTokenExpirationTime];
            await this.db.execute(sql, values);
            // Send an email to the user with a link to reset their password
            const transporter = nodemailer.createTransport({
                host: 'smtp.ionos.de',
                port: 465,
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
        }
        catch (error) {
            console.error(error.message);
            return { statusCode: 500, message: "Error sending password reset email" };
        }
    }
    async passwordReset(token, newPassword) {
        try {
            // Retrieve the hashed token and expiration time from the database
            const hashedRequestToken = CryptoES.SHA3(token).toString();
            const resetInfo = await this.getPasswordReset(hashedRequestToken);
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
                return { statusCode: 400, result: { message: passwordCheck.message, jwt: "" } };
            }
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update the user's password in the database
            await this.db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, resetInfo.id]);
            // Delete the password reset request from the database
            await this.db.execute("DELETE FROM password_resets WHERE id = ?", [resetInfo.id]);
            const user = await this.getUserByID(resetInfo.id);
            return await this.login(user.email, newPassword);
        }
        catch (error) {
            console.error(error.message);
            return { statusCode: 500, result: { message: "Error resetting password", jwt: "" } };
        }
    }
    async passwordUpdate(email, oldPassword, newPassword) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                return { statusCode: 401, message: "Unauthorized" };
            }
            const match = await new Promise((resolve, reject) => {
                bcrypt.compare(oldPassword, user.password, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            if (!match) {
                return { statusCode: 401, message: "Unauthorized" };
            }
            const hash = await bcrypt.hash(newPassword, 10);
            await this.db.execute("UPDATE users SET password = ? WHERE email = ?", [hash, email]);
            return { statusCode: 200, message: "Password updated successfully" };
        }
        catch (error) {
            console.error(error.message);
            return { statusCode: 500, message: "Error updating password" };
        }
    }
}
