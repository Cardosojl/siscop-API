import mongoose, { ClientSession, Schema, SortOrder, Types, UpdateWriteOpResult, mongo } from 'mongoose';
import { MessageRequest } from '../types/types';

export interface IMessage {
    _id?: string | Types.ObjectId;
    sender: string | Types.ObjectId | null;
    receiver: string | Types.ObjectId | null;
    process?: string | Types.ObjectId | null;
    title: string;
    process_title: string;
    content: string;
    date: string;
    visualized: boolean;
}

const message = new Schema<IMessage>(
    {
        sender: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: [true, 'Remetente é um campo obrigatório!'],
            index: true,
        },
        receiver: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: [true, 'Destinatário é um campo obrigatório!'],
            index: true,
        },
        process: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'process',
        },
        title: {
            type: String,
            required: [true, 'Título um campo obrigatório!'],
        },
        process_title: {
            type: String,
        },
        content: {
            type: String,
        },
        date: {
            type: String,
            default: Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date()),
            required: [true, 'Data é um campo obrigatório!'],
        },
        visualized: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const messageModel = mongoose.model<IMessage>('message', message);

class Messages {
    async create(body: Partial<MessageRequest>, session?: ClientSession): Promise<IMessage> {
        try {
            const message: IMessage = await new messageModel(body).save({ session });
            return message;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async findAll(parameter: Partial<MessageRequest>, select = '', include = '', sort: string | number = -1, limit = 0, page = 0): Promise<IMessage[] | null> {
        try {
            const result: IMessage[] | null = await messageModel
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

    async findOne(parameter: Partial<MessageRequest>, select = '', include = ''): Promise<IMessage | null> {
        try {
            const result: IMessage | null = await messageModel.findOne(parameter).select(select).populate(include);
            return result;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async updateOne(parameter: Partial<MessageRequest>, body: Partial<MessageRequest>, session?: ClientSession): Promise<UpdateWriteOpResult> {
        try {
            const message: UpdateWriteOpResult = await messageModel.updateOne(parameter, { $set: body }, { session, runValidators: true });
            return message;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async deleteOne(parameter: Partial<MessageRequest>, session?: ClientSession): Promise<mongo.DeleteResult> {
        try {
            const message: mongo.DeleteResult = await messageModel.deleteOne(parameter, { session });
            return message;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async deleteMany(parameter: Partial<MessageRequest>, session?: ClientSession): Promise<mongo.DeleteResult> {
        try {
            const messages: mongo.DeleteResult = await messageModel.deleteMany(parameter, { session });
            return messages;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    fields(): (keyof IMessage)[] {
        try {
            const fields = Object.values(messageModel.schema.paths).map((element) => element.path as keyof IMessage);
            return fields;
        } catch (error) {
            throw new Error(error as string);
        }
    }
}

export default new Messages();
