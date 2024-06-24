import express, { Request, Response } from "express";

import { db } from "../database.js";
import { ExpenseManagement } from "./expenses.js";

import { loginRequired } from '../middleware/auth.js';
import { RequestWithUser } from '../middleware/types.js';
import { ExpenseParams } from './types.js'
import { UserIsInGroup } from '../middleware/global.js';
 
const router = express.Router();
const expenseMgmnt = new ExpenseManagement(await db);

router.get("/", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
    const groupId = req.query.groupId as string;
    const response = await expenseMgmnt.getExpenses(parseInt(groupId));
    res.status(response.statusCode).json({ result: response.result });
});

router.get("/expense", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
    const expenseId = req.query.expenseId as string;
    const response = await expenseMgmnt.getExpense(parseInt(expenseId));
    res.status(response.statusCode).json({ result: response.result });
});

router.post("/", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
    const expense: ExpenseParams = req.body;
    const response = await expenseMgmnt.createExpense(expense);
    res.status(response.statusCode).json(response.message);
});

router.put("/", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
    const expense: ExpenseParams = req.body;
    const response = await expenseMgmnt.editExpense(expense);
    res.status(response.statusCode).json(response.message);
});

router.delete("/group/:groupID/expense/:expenseID", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
    const expenseID = req.params.expenseID;
    const response = await expenseMgmnt.deleteExpense(parseInt(expenseID));
    res.status(response.statusCode).json(response.message);
});

export default router;