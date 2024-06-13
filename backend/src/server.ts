import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authentication/routes.js";
import appLogicRoutes from "./expenses/routes.js";
import userRoutes from "./user/routes.js";
import { HttpError } from "./middleware/types.js";
import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";


// load .env file
dotenv.config();

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Rate limiter
const globLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to 150 requests per windowMs
    message: 'Too many requests, please try again later.'
});
app.use(globLimiter);

// More strict rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // limit each IP to 15 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Routes
app.use("/api/auth", authRoutes, authLimiter);
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