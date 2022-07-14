import express from "express";
import http from "http";
import authRouter from "./routes/auth.js";
import 'dotenv/config'

const app = express();

app.use('/auth', authRouter);

const server = http.createServer(app);
server.listen(80);

console.log('Started...');