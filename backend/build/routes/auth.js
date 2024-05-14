import express from "express";
import { getConnection } from "../database.js";
import { Auth } from '../auth.js';
const router = express.Router();
const auth = new Auth(await getConnection());
router.post("/signup", async (req, res) => {
    const { email, password, nickname } = req.body;
    const response = await auth.signUp(email, password, nickname);
    const result = response.result;
    const statusCode = response.statusCode;
    res.status(statusCode).json(result);
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const response = await auth.login(email, password);
    const result = response.result;
    const statusCode = response.statusCode;
    res.status(statusCode).json(result);
});
router.post("/request-password-reset", async (req, res) => {
    const { email } = req.body;
    const response = await auth.requestPasswordReset(email);
    const message = response.message;
    const statusCode = response.statusCode;
    res.status(statusCode).json(message);
});
router.post("/password-reset", async (req, res) => {
    const { token, password } = req.body;
    const response = await auth.passwordReset(token, password);
    const result = response.result;
    const statusCode = response.statusCode;
    res.status(statusCode).json(result);
});
export default router;
