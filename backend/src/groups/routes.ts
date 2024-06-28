import express, { Request, Response } from "express";

import { db } from "../database.js";
import { GroupManagement } from "./groups.js";

import { loginRequired, userIsDefined } from "../middleware/auth.js";
import { RequestWithUser } from "../middleware/types.js";
import { UserIsInGroup } from "../middleware/global.js";
import { GroupParams } from "./types.js";

const router = express.Router();
const groupMgmt = new GroupManagement(await db);

router.get("/", loginRequired, async (req: RequestWithUser, res: Response) => {
  if(userIsDefined(req)){
    const response = await groupMgmt.getGroups(req.user.id);
    res.status(response.statusCode).json({ result: response.result });
  }
});

router.get("/group", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
  const groupID = req.query.groupId as string;
  const response = await groupMgmt.getGroup(parseInt(groupID));
  res.status(response.statusCode).json({ result: response.result });
});

router.post("/", loginRequired, async (req: RequestWithUser, res: Response) => {
  if(userIsDefined(req)){
    const group: GroupParams = req.body;
    const response = await groupMgmt.createGroup(group, req.user);
    res.status(response.statusCode).json({ message: response.message });
  }
});

router.put("/", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
  const group: GroupParams = req.body;
  const response = await groupMgmt.editGroup(group);
  res.status(response.statusCode).json({ message: response.message });
});

router.delete("/group/:groupId", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
  const groupId = req.params.groupId;
  const response = await groupMgmt.deleteGroup(parseInt(groupId));
  res.status(response.statusCode).json({ message: response.message });
});

export default router;
