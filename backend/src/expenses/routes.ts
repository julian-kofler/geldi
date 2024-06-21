import express, { Request, Response } from "express";

import { db } from "../database.js";
import { ExpenseManagement } from "./expenses.js";

import { loginRequired } from '../middleware/auth.js';
import { RequestWithUser } from '../middleware/types.js';
import { ExpenseParams } from './types.js'
import { UserIsInGroup } from '../middleware/global.js';
 
const router = express.Router();
const expenseMgmnt = new ExpenseManagement(await db);

router.get("/:groupID/expenses", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
    const groupID = req.params.groupID;
    const response = await expenseMgmnt.getExpenses(parseInt(groupID));
    res.status(response.statusCode).json({ result: response.result });
});

router.post("/:groupID/expense", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
    const expense: ExpenseParams = req.body;
    const response = await expenseMgmnt.createExpense(expense);
    res.status(response.statusCode).json(response.message);
});

export default router;