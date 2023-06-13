import { Strategy as localStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import usersDB, { IUser } from '../models/Users';
import { PassportStatic } from 'passport';

export default function passportConfig(passport: PassportStatic) {
    passport.use(
        new localStrategy({ usernameField: 'name', passwordField: 'password' }, async function (name: string, password, done) {
            try {
                const user = await usersDB.findOne({ name }, '');
                if (!user) {
                    return done(null, false, { message: 'Usuário não encontrado!' });
                }
                const match = bcrypt.compareSync(password, user.password);
                if (!match) {
                    return done(null, false, { message: 'Senha inválida.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user: Partial<IUser>, done) => {
        done(null, user.name);
    });

    passport.deserializeUser(async (name: string, done) => {
        try {
            const user = await usersDB.findOne({ name }, '-password', 'section');
            if (!user) {
                return done(new Error('Usuário não encontrado.'));
            }
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}
