import acquisitionDB from '../src/models/AcquisitionWays';

async function acquisitionCreate(): Promise<void> {
    const ways = ['Dispensa', 'Licitação', 'Dispensa por Inexigibilidade'];
    for (const way of ways) {
        await acquisitionDB.create({ name: way });
    }
}

export default acquisitionCreate;
