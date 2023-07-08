import 'dotenv/config';

const whitelist: string[] = (process.env.ORIGIN as string).split(',');

const corsOptions = {
    origin: whitelist,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

export default corsOptions;
