import {Request, Response, NextFunction} from "express";

export default async function(req: Request, res: Response, next: NextFunction) {
    if(!req.session || !req.session.userId) {
        return res.status(401).send({message: 'You must be authenticated to access this.'});
    }
    next();
}