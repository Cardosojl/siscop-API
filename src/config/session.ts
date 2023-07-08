import 'dotenv/config';
import MongoConnect from 'connect-mongo';
import session, { SessionOptions } from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../models/Users';

const secret: string = process.env.SECRET as string;
const dburi: string = process.env.dbURI as string;

export const sessionDB: SessionOptions = {
    secret: secret,
    store: MongoConnect.create({ mongoUrl: dburi }) as unknown as session.Store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
    },
    rolling: true,
};
