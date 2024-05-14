import express from "express";
import dotenv from "dotenv";
import { Auth } from "./auth.js";
import { getConnection } from "./database.js";
import authRoutes from "./routes/auth.js";
// load .env file
dotenv.config();
const app = express();
const auth = new Auth(await getConnection());
// Middleware for parsing JSON bodies
app.use(express.json());
app.use("/api/auth", authRoutes);
app.listen(process.env.BACKEND_PORT, () => console.log('Server running on port ' + process.env.BACKEND_PORT));
