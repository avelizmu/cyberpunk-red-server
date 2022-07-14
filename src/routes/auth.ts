import express from 'express';
import {discordLogin} from "../controllers/auth.js";

const router = express.Router();

router.get('/oauth/discord', discordLogin);

export default router;