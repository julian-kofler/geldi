// import express, { Request, Response } from "express";

// import { getConnection } from "../database.js";
// import { Auth } from '../authentication/auth.js';
// import { ExpenseManagement } from "./expenses.js";

// import { loginRequired, userIsDefined } from '../middleware/auth.js';
// import { UserSetgns } from '../user/userSettings.js';
// import { RequestWithUser } from '../middleware/types.js';
// import { IfUserSettings } from '../user/types.js';

// const router = express.Router();
// const expense = new ExpenseManagement(await getConnection());

// router.post("/", loginRequired, async (req: RequestWithUser, res: Response) => {
//     let userID = -1;
//     if(userIsDefined(req)){
//         userID = req.user.id;
//         console.log("userID: ", userID);
//     }
//     if(userID === -1){
//         res.status(401).json({ message: "No or invalid token provided" });
//         return;
//     }

//     const { groupId, title, amount, date, payedBy, payedFor} = req.body;
//     const response = await expense.createExpense(groupId, title, amount, date, payedBy, payedFor);
//     res.status(response.statusCode).json(response.message);
// });
// router.get("/", loginRequired, async (req: RequestWithUser, res: Response) => {
//     let userID = -1;
//     if(userIsDefined(req)){
//         userID = req.user.id;
//         console.log("userID: ", userID);
//     }
//     if(userID === -1){
//         res.status(401).json({ message: "No or invalid token provided" });
//         return;
//     }
    
//     const { groupId} = req.body;
//     console.log("groupId: ", groupId);
//     const response = await expense.getExpenses(groupId);
//     res.status(response.statusCode).json({ message: response.message, result: response.result });
// });

// export default router;