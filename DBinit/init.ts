import mongoose from 'mongoose';
import 'dotenv/config';
import dbConnect from '../src/config/database';
import yearCreate from './year';
import sectionsCreate from './sections';
import userCreate from './user';
import acquisitionCreate from './acquisitionWays';
import processCreate from './process';

mongoose.Promise = global.Promise;
const dbURI: string = process.env.dbURI as string;

async function initDB() {
    await dbConnect(dbURI);
    await yearCreate();
    await sectionsCreate();
    await userCreate();
    await acquisitionCreate();
    await processCreate();
    console.log('Collections Created');
    process.exit();
}

initDB();
