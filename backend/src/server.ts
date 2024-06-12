import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authentication/routes.js";
import appLogicRoutes from "./expenses/routes.js";
import userRoutes from "./user/routes.js";
import { HttpError } from "./middleware/types.js";
import { Request, Response, NextFunction } from "express";
import cors from "cors";

// load .env file
dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/app-logic", appLogicRoutes)

// Middleware for error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        res.status(err.statusCode).send({ message: err.message });
    } else {
        res.status(500).send({ message: err.message || 'An unexpected error occurred' });
    }
});

app.listen(process.env.BACKEND_PORT, () => console.log('Server running on port ' + process.env.BACKEND_PORT));