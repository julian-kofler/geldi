import express, { Request, Response } from "express";

import { getConnection } from "../database.js";
import { Auth } from "./auth.js";
import { RequestWithUser } from "../middleware/types.js";
import { loginRequired, userIsDefined } from "../middleware/auth.js";

const router = express.Router();
const auth = new Auth(await getConnection());

router.post("/signup", async (req: Request, res: Response) => {
  // nickname is optional at this point
  const { email, password, nickname = email } = req.body;
  const response = await auth.signUp(email, password, nickname);
  res.status(response.statusCode).json(response.result);
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = await auth.login(email, password);
  res.status(response.statusCode).json(response.result);
});

router.post("/logout", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const response = await auth.logout(refreshToken);
  res.status(response.statusCode).json(response.message);
});

router.post("/refreshJWT", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const response = await auth.refreshJWT(refreshToken);
  res.status(response.statusCode).json(response.result);
});

router.post("/newRefreshToken", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const response = await auth.newRefreshToken(refreshToken);
  res.status(response.statusCode).json(response.result);
});

router.post("/request-password-reset", async (req: Request, res: Response) => {
  const { email } = req.body;
  const response = await auth.requestPasswordReset(email);
  res.status(response.statusCode).json(response.message);
});

router.post("/password-reset", async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const response = await auth.passwordReset(token, password);
  res.status(response.statusCode).json(response.result);
});

router.delete("/account", loginRequired, async (req: RequestWithUser, res: Response) => {
  if(userIsDefined(req)){
    const response = await auth.deleteAccount(req.user.id);
    res.status(response.statusCode).json(response.message);
  }
});

export default router;
