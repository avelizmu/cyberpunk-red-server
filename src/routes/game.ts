import express from 'express';
import authenticatedMiddleware from "../middleware/authenticatedMiddleware.js";
import {createGame} from "../controllers/game.js";

const router = express.Router();

router.use(authenticatedMiddleware);

router.post('/', createGame)

export default router;