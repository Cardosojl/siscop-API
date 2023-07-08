import { NextFunction, Request, Response } from 'express';

export default function loginValidation(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) res.status(401).json({ errors: [{ message: 'Acesso inválido!' }] });
    else next();
}
