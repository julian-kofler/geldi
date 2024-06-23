import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./authentication/routes.js";
import GroupRoutes from "./groups/routes.js";
import expenseRoutes from "./expenses/routes.js";
import userRoutes from "./user/routes.js";
import { logger } from "./middleware/global.js";

// load .env file
dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Middleware for logging HTTP requests
app.use(
  morgan("combined", {
    stream: { write: (message: string) => logger.info(message.trim()) },
  })
);

// Middleware for securing the app by setting various HTTP headers
app.use(
  helmet({
    hsts: false, // temporarily disabled for development
  })
);

// Middleware for parsing JSON bodies
app.use(express.json());

// strict rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: "Too many requests, please try again later.",
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/groups", GroupRoutes);

// Global rate limiter
const globLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(globLimiter);

app.listen(process.env.BACKEND_PORT, () =>
  console.log("Server running on port " + process.env.BACKEND_PORT)
);
