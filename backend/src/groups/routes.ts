import express, { Request, Response } from "express";

import { getConnection } from "../database.js";
import { GroupManagement } from "./groups.js";

const router = express.Router();
const group = new GroupManagement(await getConnection());

router.post("/getGroups", async (req: Request, res: Response) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        //todo: validate token
    } else {
        res.status(401).json({ message: "No token provided" });
    }
    const userID = req.body.userID;
    const response = await group.getGroups(userID);
    res.status(response.statusCode).json({ message: response.message, result: response.result });
});

export default router;