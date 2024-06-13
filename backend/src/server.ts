import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authentication/routes.js";
import expensesRoutes from "./expenses/routes.js";
import appLogicRoutes from "./expenses/routes.js";
import GroupRoutes from "./groups/routes.js";
import cors from "cors";
import userRoutes from "./user/routes.js";
import { HttpError } from "./middleware/types.js";
import { Request, Response, NextFunction } from "express";


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
app.use("/api/expenses", expensesRoutes);
app.use("/api/groups", GroupRoutes);

// Middleware for error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        res.status(err.statusCode).send({ message: err.message });
    } else {
        res.status(500).send({ message: err.message || 'An unexpected error occurred' });
    }
});

app.listen(process.env.BACKEND_PORT, () => console.log('Server running on port ' + process.env.BACKEND_PORT));