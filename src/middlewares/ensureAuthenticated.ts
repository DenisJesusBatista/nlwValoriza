import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction) {

    //Receber o token

    const authToken = request.headers.authorization


    //Validar se token está preenchido

    if (!authToken) {
        return response.status(401).end();

    }

    const [, token] = authToken.split(" ")


    try {
        //Validar se token é valido
        const { sub } = verify(token, "e3c655cdcb0d7741cd41621f7b704bb3") as IPayload;

        //Recuperar informações do usuário
        request.user_id = sub;

        return next();

    } catch (err) {

        return response.status(401).end();

    }

}