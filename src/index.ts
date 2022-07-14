import express from "express";
import http from "http";
import authRouter from "./routes/auth.js";
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import * as redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import {RedisClientOptions} from "redis";

const RedisStore = connectRedis(session);

let redisConfig: RedisClientOptions = {
    legacyMode: true,
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
}
if(process.env.REDIS_USERNAME) {
    redisConfig.username = process.env.REDIS_USERNAME;
}
if(process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD;
}

const redisClient = redis.createClient(redisConfig);
redisClient.connect().catch(console.error);


const app = express();

const appSession = {
    cookie: {
        maxAge: 3600000,
        httpOnly: false,
        secure: false
    },
    name: 'sessId',
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET!,
    resave: true,
    rolling: true,
    store: new RedisStore({client: redisClient}),
};
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    appSession.cookie.secure = true;
}
app.use(session(appSession));

declare module 'express-session' {
    interface SessionData {
        userId: number
    }
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/auth', authRouter);

const server = http.createServer(app);
server.listen(3000);

console.log('Started...');