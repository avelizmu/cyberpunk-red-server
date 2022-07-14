import express from 'express';
import {discordLogin, listLoginMethods} from "../controllers/auth.js";

const router = express.Router();

router.post('/oauth/discord', discordLogin);
router.get('/', listLoginMethods);

export default router;