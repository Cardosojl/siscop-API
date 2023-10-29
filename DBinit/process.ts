import processesDB from '../src/models/Processes';
import usersDB from '../src/models/Users';
import yearsDB from '../src/models/Years';
import sectionsDB from '../src/models/Sections';
import statesDB from '../src/models/ProcessStates';
import mongoose from 'mongoose';

async function processCreate(): Promise<void> {
    const session = await mongoose.startSession();
    try {
        const user = await usersDB.findOne({ name: 'ADM' });
        const section = await sectionsDB.findOne({ name: 'Informática' });
        const year = await yearsDB.findAll();
        const date = Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date());
        session.startTransaction();
        const process = await processesDB.create(
            {
                user: user?._id,
                origin: section?._id,
                title: 'Aquisição de Computadores',
                year: year ? year[0].year : '2023',
                date: date,
            },
            session
        );
        const newState = {
            process: process._id as string,
            state: 'Processo Cadastrado',
            anotation: `Processo Cadastrado Por ${user?.pg} ${user?.name}`,
            date: date,
        };
        await statesDB.create(newState, session);
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
    } finally {
        session.endSession();
    }
}

export default processCreate;
