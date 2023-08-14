import mongoose, { Aggregate, ClientSession, Schema, SortOrder, Types, UpdateWriteOpResult, mongo } from 'mongoose';
import { ProcessRequest } from '../types/types';
import { IProcessState } from './ProcessStates';

export interface IProcess {
    _id?: string | Types.ObjectId;
    user?: string | Types.ObjectId | null;
    receiver?: string | Types.ObjectId | null;
    section_receiver?: string | Types.ObjectId | null;
    nup?: string;
    done: boolean | undefined;
    origin: string | Types.ObjectId;
    title: string;
    category?: string;
    description?: string;
    date: string | undefined;
    year: string | undefined;
}

const process = new Schema<IProcess>(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
        },
        receiver: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
        },
        section_receiver: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'section',
        },
        nup: {
            type: String,
        },
        done: {
            type: Boolean,
            default: false,
            required: [true, 'Done é um campo obrigatório!'],
        },
        origin: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'section',
            required: [true, 'Origin é um campo obrigatório!'],
        },
        title: {
            type: String,
            required: [true, 'Título é um campo obrigatório!'],
        },
        category: {
            type: String,
        },
        description: {
            type: String,
        },
        date: {
            type: String,
            default: Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date()),
            required: [true, 'Date é um campo obrigatório!'],
        },
        year: {
            type: String,
            default: new Date().getFullYear().toString(),
            index: true,
            required: [true, 'Year é um campo obrigatório!'],
        },
    },
    { timestamps: true }
);

const processModel = mongoose.model<IProcess>('process', process);

class Processes {
    private queryStringConversor(queryString: Partial<ProcessRequest>) {
        const convertedQueryString: Partial<ProcessRequest> = {};
        let key: keyof Partial<ProcessRequest>;
        for (key in queryString) {
            if (key === 'done') convertedQueryString.done = queryString[key] === 'true' ? true : false;
            else if (key === 'user' || key === 'receiver' || key === 'section_receiver' || key === 'origin' || key === '_id') {
                convertedQueryString[key] = new Types.ObjectId(`${queryString[key]}`);
            } else {
                convertedQueryString[key] = `${queryString[key]}`;
            }
        }
        return convertedQueryString;
    }

    async create(body: Partial<ProcessRequest>, session: ClientSession): Promise<IProcess> {
        try {
            const newProcess = {
                ...body,
                nup: body.nup ? (body.nup as string).replace(/\./g, '').replace(/\//g, '').replace(/-/, '').trim() : undefined,
                title: body.title ? (body.title as string).replace(/\./g, '').replace(/_/g, ' ').replace(/\//g, '') : undefined,
            };
            const process = await new processModel(newProcess).save({ session });
            return process;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    // eslint-disable-next-line prettier/prettier
    async findAll(parameter: Partial<ProcessRequest> = {}, select = '', include = '', sort: string | number = -1, limit = 0, page = 0): Promise<IProcess[] | null> {
        try {
            const result: IProcess[] | null = await processModel
                .find(parameter)
                .select(select)
                .populate(include)
                .sort({ createdAt: sort as SortOrder })
                .skip(limit * page)
                .limit(limit);
            return result;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async findOne(parameter: Partial<ProcessRequest>, select = '', include = ''): Promise<IProcess | null> {
        try {
            const result: IProcess | null = await processModel.findOne(parameter).select(select).populate(include);
            return result;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async aggregate(parameter: Partial<ProcessRequest>, sort: string | number = -1, limit = 0, page = 0, aggregate: string) {
        try {
            const match = this.queryStringConversor(parameter);
            const agg = await processModel
                .aggregate()
                .match(match)
                .lookup({ from: aggregate, localField: '_id', foreignField: 'process', as: aggregate })
                .sort({ createdAt: sort as SortOrder })
                .skip(limit * page)
                .limit(+limit);
            return agg;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async updateOne(parameter: Partial<ProcessRequest>, body: Partial<ProcessRequest>, session?: ClientSession): Promise<UpdateWriteOpResult> {
        try {
            const process: UpdateWriteOpResult = await processModel.updateOne(parameter, { $set: body }, { session, runValidators: true });
            return process;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async deleteOne(parameter: Partial<ProcessRequest>, session: ClientSession): Promise<mongo.DeleteResult> {
        try {
            const process: mongo.DeleteResult = await processModel.deleteOne(parameter, { session });
            return process;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    fields(): (keyof IProcess)[] {
        try {
            const fields = Object.values(processModel.schema.paths).map((element) => element.path as keyof IProcess);
            return fields;
        } catch (error) {
            throw new Error(error as string);
        }
    }
}

export default new Processes();
