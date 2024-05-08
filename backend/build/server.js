"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 80;
app.get('/api', (req, res) => {
    res.send('Backend - REST API');
});
app.get("/api/auth/signup", (req, res) => {
    res.send("Signup");
});
app.get("/api/auth/signin", (req, res) => {
    res.send("Signin");
});
app.listen(port, () => console.log('Server running on port ' + port));
