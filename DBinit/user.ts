import usersDB from '../src/models/Users';
import sectionsDB from '../src/models/Sections';
import { UserRequest } from '../src/types/types';

async function userCreate(): Promise<void> {
    const admSection = await sectionsDB.findOne({ name: 'ADM' });
    const user: Partial<UserRequest> = {
        name: 'ADM',
        password: '123456',
        section: admSection?._id as string,
        level: 10,
    };

    await usersDB.create(user);
}

export default userCreate;
