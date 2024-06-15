import express, { Request, Response } from "express";

import { getConnection } from "../database.js";
import { GroupManagement } from "./groups.js";
import { ExpenseManagement } from "../expenses/expenses.js";

import { loginRequired, userIsDefined } from '../middleware/auth.js';
import { UserSetgns } from '../user/userSettings.js';
import { RequestWithUser } from '../middleware/types.js';
import { IfUserSettings } from '../user/types.js';


const router = express.Router();
const group = new GroupManagement(await getConnection());
const expense = new ExpenseManagement(await getConnection());

router.get("/", loginRequired, async (req: RequestWithUser, res: Response) => {
    let userID = -1;
    if (userIsDefined(req)) {
        userID = req.user.id;
    }
    if (userID === -1) {
        res.status(401).json({ message: "No or invalid token provided" });
        return;
    }

    const response = await group.getGroups(userID);
    res.status(response.statusCode).json({ message: response.message, result: response.result });
});
router.post("/", loginRequired, async (req: RequestWithUser, res: Response) => {
    let userID = -1;
    if (userIsDefined(req)) {
        userID = req.user.id;
    }
    if (userID === -1) {
        res.status(401).json({ message: "No or invalid token provided" });
        return;
    }

    const { name, members } = req.body;
    const response = await group.createGroup(name, members);
    res.status(response.statusCode).json({ message: response.message });
});
router.get("/:groupID/expenses", loginRequired, async (req: RequestWithUser, res: Response) => {
    let userID = -1;
    if (userIsDefined(req)) {
        userID = req.user.id;
    }
    if (userID === -1) {
        res.status(401).json({ message: "No or invalid token provided" });
        return;
    }
    const groupID = req.params.groupID;
    const response = await expense.getExpenses(parseInt(groupID));
    res.status(response.statusCode).json({ message: response.message, result: response.result });
});
router.post("/:groupID/expenses", loginRequired, async (req: RequestWithUser, res: Response) => {
    let userID = -1;
    if (userIsDefined(req)) {
        userID = req.user.id;
    }
    if (userID === -1) {
        res.status(401).json({ message: "No or invalid token provided" });
        return;
    }

    const { groupId, title, amount, date, payedBy, payedFor } = req.body;
    const response = await expense.createExpense(groupId, title, amount, date, payedBy, payedFor);
    res.status(response.statusCode).json(response.message);
});


export default router;