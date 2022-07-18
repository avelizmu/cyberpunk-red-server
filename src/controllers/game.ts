import {Request, Response} from "express";
import Joi, {ValidationError} from "joi";
import database from "../database/index.js";

export const createGame = async function(req: Request, res: Response) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(255)
            .regex(/^[a-zA-Z0-9 &.,\-\\/]+$/)
            .required()
    });

    try {
        const {name} = await schema.validateAsync(req.body);

        const [code, message] = await database
            .transaction()
            .execute(async (trx) => {
                const createResult = await trx.insertInto('Game')
                    .values({
                        name,
                        owner: req.session.userId!
                    })
                    .executeTakeFirst();
                if(!createResult) {
                    return [500, {message: 'An error has occurred on the server.'}];
                }

                const game = await trx.selectFrom('Game')
                    .selectAll()
                    .where('id', '=', Number(createResult.insertId))
                    .executeTakeFirst();
                if(!game) {
                    return [500, {message: 'An error has occurred on the server.'}];
                }

                const playerCreateResult = await trx.insertInto('Player')
                    .values({
                        gameId: game.id,
                        userId: req.session.userId!
                    })
                    .executeTakeFirst();
                if(!playerCreateResult) {
                    return [500, {message: 'An error has occurred on the server.'}];
                }

                return [201, game];
            })

        return res.status(code).send(message);
    }
    catch(err: any) {
        if(err.isJoi) {
            return res.status(400).send({message: (err as ValidationError).message})
        }

        console.error(err);
        return res.status(500).send({message: 'An error has occurred on the server.'});
    }
}

export const listGames = async function(req: Request, res: Response) {
    const ownPlayer = await database.selectFrom('Player')
        .where('userId', '=', req.session.userId!)
        .innerJoin('Game', 'Player.gameId', 'Game.id')
        .selectAll()
        .execute();

    return res.status(200).send(ownPlayer.map(g => ({id: g.gameId, name: g.name, owner: g.owner})));
}