import passport, { AuthenticateCallback } from 'passport';
import usersDB, { IUser } from '../models/Users';
import { Request, Response } from 'express';

class LoginController {
    store(req: Request, res: Response) {
        const errors: Record<string, string>[] = [];
        passport.authenticate('local', (error: string, user: Express.User) => {
            if (error) {
                errors.push({ text: error });
                return res.status(400).json({ errors });
            } else {
                if (!user) {
                    errors.push({ text: 'Usuário ou senha inválidas.' });
                    return res.status(400).json({ errors });
                } else {
                    req.login(user, (error) => {
                        if (error) {
                            return res.status(400).json({ error });
                        } else {
                            return res.status(201).json({ user });
                        }
                    });
                }
            }
        })(req, res);
    }

    delete(req: Request, res: Response) {
        req.logout((error) => {
            if (error) return error;
            req.session.destroy((error) => {
                if (error) return res.status(500).json({ error });
            });
            res.status(200).json({ Session: 'Finished.' });
        });
    }
}

export default new LoginController();
