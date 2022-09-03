import express from 'express';
import authenticatedMiddleware from "../middleware/authenticatedMiddleware.js";
import {listCharacters} from "../controllers/character.js";

const router = express.Router();

router.use(authenticatedMiddleware);

router.get('/', listCharacters);

export default router;