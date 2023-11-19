import sectionsDB from '../src/models/Sections';

const level1 = ['Transporte', 'Recursos Humanos', 'Administrativo', 'Comunicações', 'Almoxarifado', 'Informática'];
const level2 = ['Fiscal', 'Ordenador de Despesas', 'Seção de Orçamentos', 'Pregoeiro'];
const level10 = ['ADM'];

async function sectionsCreate(): Promise<void> {
    for (const section of level1) {
        await sectionsDB.create({ name: section, level: '1' });
    }

    for (const section of level2) {
        await sectionsDB.create({ name: section, level: '2' });
    }

    for (const section of level10) {
        await sectionsDB.create({ name: section, level: '10' });
    }
}

export default sectionsCreate;
