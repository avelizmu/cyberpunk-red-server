import express from 'express';
import authenticatedMiddleware from "../middleware/authenticatedMiddleware.js";
import {createGame, listGames} from "../controllers/game.js";

const router = express.Router();

router.use(authenticatedMiddleware);

router.post('/', createGame)
router.get('/', listGames);

export default router;