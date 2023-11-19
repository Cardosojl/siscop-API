import yearsDB from '../src/models/Years';

async function yearCreate(): Promise<void> {
    await yearsDB.create({ year: new Date().getFullYear().toString() });
}

export default yearCreate;
