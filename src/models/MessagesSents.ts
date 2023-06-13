import mongoose, { ClientSession, Schema, SortOrder, Types, UpdateWriteOpResult, mongo } from 'mongoose';
import { MessageRequest } from '../types/types';

export interface IMessageSent {
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

const messageSent = new Schema<IMessageSent>(
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

const messageSentModel = mongoose.model<IMessageSent>('messagesent', messageSent);

class MessageSent {
    async create(body: Partial<MessageRequest>, session?: ClientSession): Promise<IMessageSent> {
        try {
            const message: IMessageSent = await new messageSentModel(body).save({ session });
            return message;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    // eslint-disable-next-line prettier/prettier
    async findAll(parameter: Partial<MessageRequest>, select = '', include = '', sort: string | number = -1, limit = 0, page = 0): Promise<IMessageSent[] | null> {
        try {
            const result: IMessageSent[] | null = await messageSentModel
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

    async findOne(parameter: Partial<MessageRequest>, select = '', include = ''): Promise<IMessageSent | null> {
        try {
            const result: IMessageSent | null = await messageSentModel.findOne(parameter).select(select).populate(include);
            return result;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async updateOne(parameter: Partial<MessageRequest>, body: Partial<IMessageSent>, session?: ClientSession): Promise<UpdateWriteOpResult> {
        try {
            const message: UpdateWriteOpResult = await messageSentModel.updateOne(parameter, { $set: body }, { session, runValidators: true });
            return message;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async deleteOne(parameter: Partial<MessageRequest>, session?: ClientSession): Promise<mongo.DeleteResult> {
        try {
            const message: mongo.DeleteResult = await messageSentModel.deleteOne(parameter, { session });
            return message;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async deleteMany(parameter: Partial<MessageRequest>, session?: ClientSession): Promise<mongo.DeleteResult> {
        try {
            const messages: mongo.DeleteResult = await messageSentModel.deleteMany(parameter, { session });
            return messages;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    fields(): (keyof IMessageSent)[] {
        try {
            const fields = Object.values(messageSentModel.schema.paths).map((element) => element.path as keyof IMessageSent);
            return fields;
        } catch (error) {
            throw new Error(error as string);
        }
    }
}

export default new MessageSent();
