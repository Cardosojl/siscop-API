import { Request, Response } from 'express';
import messagesDB, { IMessage } from '../models/Messages';
import { messageValidator } from '../config/validators';
import mongoose from 'mongoose';
import messageArchivedsDB, { IMessageArchived } from '../models/MessageArchiveds';
import { MessageRequest } from '../types/types';

class MessageArchivedsController {
    async store(req: Request, res: Response): Promise<Response> {
        const session = await mongoose.startSession();
        try {
            const body = req.body as Partial<MessageRequest>;
            const bodyValidation: Partial<MessageRequest>[] = messageValidator(body);
            if (bodyValidation.length > 0) return res.status(400).json({ errors: bodyValidation });
            const message: IMessage | null = await messagesDB.findOne({ _id: body.message as string }, '-_id');
            if (!message) return res.status(404).json({ error: 'Message não encontrada!' });
            session.startTransaction();
            const archivedValues: Partial<MessageRequest> = {};
            messageArchivedsDB
                .fields()
                .filter((element) => element !== '_id')
                .forEach((element) => (archivedValues[element] = `${message[element as keyof IMessage]}`));
            const archived: IMessageArchived = await messageArchivedsDB.create(archivedValues, session);
            await messagesDB.deleteOne({ _id: body.message } as Partial<IMessage>, session);
            await session.commitTransaction();
            return res.status(201).json({ archived });
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            return res.status(500).json({ error: (error as Record<string, string>).message });
        } finally {
            session.endSession();
        }
    }

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query as Partial<MessageRequest>;
            const { select, include, sort, limit, page } = query;
            const fields: (keyof IMessageArchived)[] = messageArchivedsDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element: string) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (queryValidation.length > 0) return res.status(400).json({ errors: queryValidation });
            param.forEach((element) => {
                element === '_id' || element === 'sender' || element === 'receiver' || element === 'process'
                    ? (parameter[element] = `${query[element]}`)
                    : (parameter[element] = new RegExp(`${query[element]}`, 'i'));
            });
            const messages: IMessageArchived[] | null = await messageArchivedsDB.findAll(
                parameter,
                select as string,
                include as string,
                sort as string,
                limit as number,
                page as number
            );
            if (messages?.length === 0) return res.status(404).json({ error: 'Message não encontrada' });
            return res.status(200).json({ messages });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query as Partial<MessageRequest>;
            const { select, include } = query;
            const fields: (keyof IMessageArchived)[] = messageArchivedsDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido!' });
            if (queryValidation.length > 0) return res.status(400).json({ errors: queryValidation });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const message: IMessageArchived | null = await messageArchivedsDB.findOne(parameter, select as string, include as string);
            if (!message) return res.status(404).json({ error: 'Message não encontrada!' });
            return res.status(200).json({ message });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query as Partial<MessageRequest>;
            const fields: (keyof IMessageArchived)[] = messageArchivedsDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido' });
            if (queryValidation.length > 0) return res.status(400).json({ error: queryValidation });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const message: IMessageArchived | null = await messageArchivedsDB.findOne(parameter);
            if (!message) return res.status(404).json({ error: 'Message não encontrada!' });
            const messageD = await messageArchivedsDB.deleteOne(parameter);
            return res.status(200).json({ messageD });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }
}

export default new MessageArchivedsController();
