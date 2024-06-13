import cron from "node-cron";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zxcvbn from 'zxcvbn';
import validator from 'validator';

export class InputValidation{
    private commonPasswordsURL: string = "https://lucidar.me/en/security/files/100000-most-common-passwords.json";
    private commonPasswordsPath: string = "";

    constructor(){
        this.scheduleAutomaticTasks();
        this.commonPasswordsPath = path.join(fileURLToPath(import.meta.url), '../../../data/' + this.commonPasswordsURL.split('/').pop()!);    
        if(!fs.existsSync(this.commonPasswordsPath)){
            this.fetchCommonPasswords();
        }
        if(!fs.existsSync(this.commonPasswordsPath)){
            throw new Error("Common passwords file not found");
        }
    }

    private scheduleAutomaticTasks(): void {
        cron.schedule('0 0 * * *', async () => {
            try {
                this.fetchCommonPasswords();
            } catch (error) {
                console.error((error as Error).message);
            }
        });
    }

    private async fetchCommonPasswords(): Promise<void> {
        // Fetch the passwords from the API
        const response = await fetch(this.commonPasswordsURL);
        const commonPasswords = await response.json();

        // Save the passwords to a file
        fs.writeFileSync(this.commonPasswordsPath, JSON.stringify(commonPasswords));
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

    public async isValidEmail(email: string): Promise<{valid:boolean, message:string}> {
        if(!email){
            return { valid: false, message: "email is required" };
        }
        else if(!validator.isEmail(email)){
            return { valid: false, message: "invalid email address" };
        }
        return { valid: true, message: "" };
    }

    public async isValidPassword(password: string): Promise<{valid:boolean, message:string}> {
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
}