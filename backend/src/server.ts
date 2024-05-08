import express, { Express, Request, Response } from "express";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// load .env file
dotenv.config();

const app = express();
const port = 80;

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Middleware to interpret JSON data sent in the body of HTTP requests
app.use(express.json());

app.get('/api', (req:Request, res:Response) => {
  res.send('Backend - REST API');
});

app.post("/api/auth/signup", (req: Request, res: Response) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).send({ error: "Error hashing password" });
    } else {
      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hash],
        (error, results) => {
          if (error) {
            res.status(500).send({ error: "Error registering user" });
          } else {
            res.send("User registered successfully");
          }
        }
      );
    }
  });
});

app.post("/api/auth/signin", (req: Request, res: Response) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?", [email], (error, results) => {
      if (error || results.length === 0) {
        res.status(401).send({ error: "User not found" });
      } 
      else {
        bcrypt.compare(password, results[0].password, (err, result) => {
          if (result) {
            const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET!, {
              expiresIn: "1h",
            });
            res.send({ token });
          } 
          else {
            res.status(401).send({ error: "Invalid password" });
          }
        });
      }
    }
  );
});

app.post("/api/auth/password-reset", (req: Request, res: Response) => {
  const { email} = req.body;

});

app.post("/api/auth/password-update", (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;
  
});

app.listen(port, () => console.log('Server running on port ' + port));