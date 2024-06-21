import express, { Request, Response } from "express";

import { db } from "../database.js";
import { GroupManagement } from "./groups.js";

import { loginRequired, userIsDefined } from "../middleware/auth.js";
import { RequestWithUser } from "../middleware/types.js";
import { UserIsInGroup } from "../middleware/global.js";

const router = express.Router();
const groupMgmt = new GroupManagement(await db);

router.get("/", loginRequired, async (req: RequestWithUser, res: Response) => {
  if(userIsDefined(req)){
    const response = await groupMgmt.getGroups(req.user.id);
    res.status(response.statusCode).json({ result: response.result });
  }
});

router.post("/", loginRequired, async (req: RequestWithUser, res: Response) => {
  if(userIsDefined(req)){
    const { name, members } = req.body;
    const response = await groupMgmt.createGroup(name, members);
    res.status(response.statusCode).json({ message: response.message });
  }
});

router.get("/:groupID/members", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) => {
    if(userIsDefined(req)){
      const groupID = req.params.groupID;
      const response = await groupMgmt.getMembers(parseInt(groupID));
      res.status(response.statusCode).json({ result: response.result });
    }
});

router.post("/:groupID/inviteMember", loginRequired, UserIsInGroup, async (req: RequestWithUser, res: Response) =>{
    if (userIsDefined(req)) {
      const groupID = req.params.groupID;
      const { email } = req.body;
      const response = await groupMgmt.inviteMember(email, parseInt(groupID));
      res.status(response.statusCode).json({ message: response.message });
    }
});

export default router;
