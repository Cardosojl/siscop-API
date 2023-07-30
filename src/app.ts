import express, { Application } from 'express';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
import passportConfig from './config/passportConfig';
import { sessionDB } from './config/session';
import corsOptions from './config/cors';
import login from './routes/loginRoute';
import years from './routes/yearsRoute';
import users from './routes/usersRoute';
import sections from './routes/sectionsRoute';
import processes from './routes/processesRoute';
import processStates from './routes/processStatesRoute';
import files from './routes/filesRoute';
import messages from './routes/messagesRoute';
import messageSents from './routes/messageSentsRoute';
import messageArchiveds from './routes/messageArchivedsRoute';
import acquisitionWays from './routes/acquisitionWaysRoute';
import fileBuffer from './routes/fileBufferRoute';

class App {
    app: Application;
    constructor() {
        this.app = express();
        passportConfig(passport);
        this.middlewares();
        this.routes();
    }

    private middlewares(): void {
        this.app.use(cors(corsOptions));
        this.app.use(express.json());
        this.app.use(session(sessionDB));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    private routes(): void {
        this.app.use('/', login);
        this.app.use('/years', years);
        this.app.use('/users', users);
        this.app.use('/sections', sections);
        this.app.use('/processes', processes);
        this.app.use('/processStates', processStates);
        this.app.use('/files', files);
        this.app.use('/messages', messages);
        this.app.use('/messageSents', messageSents);
        this.app.use('/messageArchiveds', messageArchiveds);
        this.app.use('/acquisitionWays', acquisitionWays);
        this.app.use('/fileBuffer', fileBuffer);
    }
}

export default new App().app;
