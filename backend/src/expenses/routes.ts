import express, { Request, Response } from "express";

import { getConnection } from "../database.js";
import { Auth } from '../authentication/auth.js';

const router = express.Router();
const auth = new Auth(await getConnection());

router.post("/createExpense", async (req: Request, res: Response) => {
    
});

export default router;