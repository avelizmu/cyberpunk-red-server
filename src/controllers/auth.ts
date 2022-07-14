import {Request, Response} from "express";
import Joi, {ValidationError} from "joi";
import axios from "axios";
import database from "../database/index.js";

export const discordLogin = async function(req: Request, res: Response) {
    const schema = Joi.object({
        code: Joi.string()
            .required()
    });

    try {
        const {code} = await schema.validateAsync(req.body);

        const params = new URLSearchParams();

        params.append('client_id', process.env.DISCORD_CLIENT_ID as string);
        params.append('client_secret', process.env.DISCORD_CLIENT_SECRET as string);
        params.append('grant_type', 'authorization_code');
        params.append('code', code as string);
        params.append('redirect_uri', process.env.DISCORD_REDIRECT_URI as string);

        const accessCodeResponse = await axios.post(process.env.DISCORD_API_ENDPOINT as string, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        let identityResponse = await axios.get('https://discordapp.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${accessCodeResponse.data.access_token}`
            }
        });
        if(!identityResponse.data.email) {
            return res.status(401).send({message: 'Could not retrieve email.'});
        }
        if(!identityResponse.data.username) {
            return res.status(401).send({message: 'Could not retrieve username.'});
        }

        const user = await database.selectFrom('User')
            .selectAll()
            .where('email', '=', identityResponse.data.email)
            .executeTakeFirst();

        if(user) {
            req.session.userId = user.id;
            return res.status(200).send(user);
        }

        let createResult = await database.insertInto('User')
            .values({
                name: identityResponse.data.username,
                email: identityResponse.data.email
            })
            .execute();
        if(createResult.length !== 1) {
            console.error('Failed to create user');
            return res.status(500).send({message: 'An error has occurred on the server.'});
        }

        const createdUser = await database.selectFrom('User')
            .selectAll()
            .where('id', '=', Number(createResult[0].insertId))
            .executeTakeFirst();
        if(!createdUser) {
            console.error('Failed to get created user');
            return res.status(500).send({message: 'An error has occurred on the server.'});
        }

        req.session.userId = createdUser.id;
        return res.status(201).send(createdUser);
    }
    catch(err: any) {
        if(err.isJoi) {
            return res.status(400).send({message: (err as ValidationError).message})
        }

        if(err.response && err.status < 500) {
            return res.status(err.status).send(err.message);
        }

        console.error(err);
        return res.status(500).send({message: 'An error has occurred on the server.'});
    }
}

export const listLoginMethods = async function(req: Request, res: Response) {
    let methods: {[key: string]: string} = {};
    if(process.env.DISCORD_LOGIN_ENABLED === "true") {
        methods.discord = process.env.DISCORD_OAUTH_URL as string
    }

    return res.status(200).send(methods);
}