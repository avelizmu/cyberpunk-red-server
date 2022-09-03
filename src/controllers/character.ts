import {Request, Response} from "express";
import database from "../database/index.js";
import Joi, {ValidationError} from "joi";

export const listCharacters = async function(req: Request, res: Response) {
    const ownedCharacters = await database.selectFrom('Character')
        .selectAll()
        .where('ownerId', '=', req.session.userId!)
        .execute();

    return res.status(200).send(ownedCharacters);
}

