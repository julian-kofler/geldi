import express, { Request, Response } from "express";

import { getConnection } from "../database.js";
import { Auth } from '../authentication/auth.js';
import { ExpenseManagement } from "./expenses.js";

const router = express.Router();
const expense = new ExpenseManagement(await getConnection());

router.post("/createExpense", async (req: Request, res: Response) => {
    const { groupId, title, amount, date, payedBy, payedFor} = req.body;
    const response = await expense.createExpense(groupId, title, amount, date, payedBy, payedFor);
    res.status(response.statusCode).json(response.message);
});

export default router;