import mongoose, { Schema, Types, UpdateWriteOpResult, mongo } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRequest } from '../types/types';

export interface IUser {
    _id?: string | Types.ObjectId;
    name: string;
    password: string;
    section: string | Types.ObjectId;
    level: number;
}

async function nameValidator(value: string): Promise<boolean> {
    try {
        const user: IUser | null = await mongoose.model('user').findOne({ name: value });
        if (user) {
            return false;
        }
        return true;
    } catch (error) {
        throw new Error(error as string);
    }
}

const user = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Nome é um campo obrigatório'],
        unique: true,
        validate: {
            validator: nameValidator,
            message: 'Este nome já possuí cadastro!',
        },
    },
    password: {
        type: String,
        required: [true, 'Senha é um campo obrigatório'],
    },
    section: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'section',
    },
    level: {
        type: Number,
        required: [true, 'Level é um campo obrigatório'],
        cast: 'Este Campo precisa ser preenchido por um numeral!',
    },
});

const userModel = mongoose.model<IUser>('user', user);

class Users {
    async create(body: Partial<UserRequest>): Promise<IUser> {
        try {
            const user: IUser = await new userModel({
                name: body.name,
                password: await bcrypt.hash(body.password as string, 10),
                section: body.section,
                level: body.level,
            }).save();
            return user;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async findAll(parameter: Partial<UserRequest> = {}, select = '', include = '', limit = 0, page = 0): Promise<IUser[] | null> {
        try {
            const result: IUser[] | null = await userModel
                .find(parameter)
                .select(select)
                .populate(include)
                .skip(limit * page)
                .limit(limit);
            return result;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async findOne(parameter: Partial<UserRequest>, select = '', include = ''): Promise<IUser | null> {
        try {
            const result: IUser | null = await userModel.findOne(parameter).select(select).populate(include);
            return result;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async updateOne(parameter: Partial<UserRequest>, body: Partial<UserRequest>): Promise<UpdateWriteOpResult> {
        try {
            if (body.password) {
                body = {
                    ...body,
                    password: await bcrypt.hash(body.password as string, 10),
                };
            }
            const user: UpdateWriteOpResult = await userModel.updateOne(parameter, { $set: body }, { runValidators: true });
            return user;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async deleteOne(parameter: Partial<UserRequest>): Promise<mongo.DeleteResult> {
        try {
            const user: mongo.DeleteResult = await userModel.deleteOne(parameter);
            return user;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async userValidation(body: Partial<UserRequest>): Promise<IUser | boolean | null> {
        try {
            const user: IUser | null = await userModel.findOne({ name: body.name });
            if (!user) {
                return null;
            }
            if (await bcrypt.compare(body.password as string, user.password)) {
                return user;
            }
            return false;
        } catch (error) {
            console.log(error);
            throw new Error(error as string);
        }
    }

    fields(): (keyof IUser)[] {
        try {
            const fields = Object.values(userModel.schema.paths).map((element) => element.path as keyof IUser);
            return fields;
        } catch (error) {
            throw new Error(error as string);
        }
    }
}

export default new Users();
