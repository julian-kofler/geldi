import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authentication/routes.js";
import appLogicRoutes from "./expenses/routes.js";

// load .env file
dotenv.config();

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/app-logic", appLogicRoutes)

app.listen(process.env.BACKEND_PORT, () => console.log('Server running on port ' + process.env.BACKEND_PORT));