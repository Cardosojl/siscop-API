import passport, { AuthenticateCallback } from 'passport';
import { Request, Response } from 'express';
import { IUser } from '../models/Users';

class LoginController {
    store(req: Request, res: Response) {
        passport.authenticate('local', (error: string, user: Partial<IUser>) => {
            if (error) {
                return res.status(400).json({ errors: [{ message: error }] });
            } else {
                if (!user) {
                    return res.status(400).json({ errors: [{ message: 'Usuário ou senha inválidas.' }] });
                } else {
                    req.login(user, (error) => {
                        if (error) {
                            return res.status(400).json({ errors: [{ message: error.message }] });
                        } else {
                            user.password = undefined;
                            return res.status(201).json({ user });
                        }
                    });
                }
            }
        })(req, res);
    }

    delete(req: Request, res: Response) {
        req.logout((error) => {
            if (error) return res.status(500).json({ errors: [{ message: error.message }] });
            req.session.destroy((error) => {
                if (error) return res.status(500).json({ errors: [{ message: error.message }] });
            });
            res.status(200).json({ Session: 'Finished.' });
        });
    }
}

export default new LoginController();
