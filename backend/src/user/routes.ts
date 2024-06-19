import express, { Response } from "express";

import { RequestWithUser } from "../middleware/types.js";
import { UserSetgns } from "./userSettings.js";
import { IfUserSettings } from "./types.js";
import { loginRequired, userIsDefined } from "../middleware/auth.js";
import { db } from "../database.js";

const router = express.Router();
const userSetgns = new UserSetgns(await db);

router.post(
  "/updateSettings",
  loginRequired,
  async (req: RequestWithUser, res: Response) => {
    if (userIsDefined(req)) {
      const userSettings: IfUserSettings = req.body;
      const response = await userSetgns.updateSettings(
        userSettings,
        req.user.id
      );
      res.status(response.statusCode).json(response.result);
    }
  }
);

router.get(
  "/getSettings",
  loginRequired,
  async (req: RequestWithUser, res: Response) => {
    if (userIsDefined(req)) {
      const response = await userSetgns.getSettings(req.user.id);
      res.status(response.statusCode).json(response.result);
    }
  }
);
router.get(
  "/nickname/:userid",
  loginRequired,
  async (req: RequestWithUser, res: Response) => {
    if (userIsDefined(req)) {
      const response = await userSetgns.getSettings(
        parseInt(req.params.userid)
      );
      res.status(response.statusCode).json(response.result);
    }
  }
);
router.get(
  "/myUserId",
  loginRequired,
  async (req: RequestWithUser, res: Response) => {
    if (userIsDefined(req)) {
      res.status(200).json({ userId: req.user.id });
    }
  }
);
router.get(
  "/userid/:email",
  loginRequired,
  async (req: RequestWithUser, res: Response) => {
    if (userIsDefined(req)) {
      const response = await userSetgns.getUserByEmail(req.params.email);
      res.status(response.statusCode).json(response);
    }
  }
);
export default router;
