import { Request, Response } from 'express';
import messagesDB, { IMessage } from '../models/Messages';
import messagesSentsDB, { IMessageSent } from '../models/MessagesSents';
import usersdb, { IUser } from '../models/Users';
import processesDB, { IProcess } from '../models/Processes';
import processStatesDB, { IProcessState } from '../models/ProcessStates';
import { MessageRequest } from '../types/types';
import { messageValidator } from '../config/validators';
import mongoose, { ClientSession } from 'mongoose';

class MessagesController {
    async store(req: Request, res: Response): Promise<Response> {
        const session = await mongoose.startSession();
        try {
            let body = req.body as Partial<MessageRequest>;
            const bodyValidation: Partial<MessageRequest>[] = messageValidator(body);
            if (bodyValidation.length > 0) return res.status(400).json({ errors: bodyValidation });
            const sender: IUser | null = await usersdb.findOne({ _id: body.sender as string });
            if (!sender) return res.status(404).json({ error: 'Sender Não encontrado!' });
            if (body.process) {
                const process: IProcess | null = await processesDB.findOne({ _id: body.process });
                if (!process) return res.status(404).json({ error: 'Process não encontrado!' });
                body = { ...body, process_title: process.title };
                if (
                    (process.user !== null && `${sender._id}` !== `${process.user}`) ||
                    (process.user === null && `${sender._id}` !== `${process.receiver}` && `${sender.section}` !== `${process.section_receiver}`)
                ) {
                    return res.status(400).json({ error: 'Você não pode enviar este processo!' });
                }
            } else {
                body = { ...body, process_title: 'Sem Processo' };
            }
            if (body.receiver) {
                return await handleReceiver(res, body, sender, session);
            }
            if (body.section_receiver) {
                return await handleSectionReceiver(res, body, sender, session);
            }
            return res.status(400).json({ error: 'É necessário um receiver ou uma section_receiver!' });
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
            const fields: (keyof IMessageSent)[] = messagesDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (queryValidation.length > 0) return res.status(400).json({ errors: queryValidation });
            param.forEach((element) => {
                element === '_id' || element === 'sender' || element === 'receiver' || element === 'process'
                    ? (parameter[element] = `${query[element]}`)
                    : (parameter[element] = new RegExp(`${query[element]}`, 'i'));
            });
            const messages: IMessage[] | null = await messagesDB.findAll(
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
            const fields: (keyof IMessage)[] = messagesDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido!' });
            if (queryValidation.length > 0) return res.status(400).json({ errors: queryValidation });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const message: IMessage | null = await messagesDB.findOne(parameter, select as string, include as string);
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
            const fields: (keyof IMessage)[] = messagesDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido' });
            if (queryValidation.length > 0) return res.status(400).json({ error: queryValidation });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const message: IMessage | null = await messagesDB.findOne(parameter);
            if (!message) return res.status(404).json({ error: 'Message não encontrada!' });
            const messageD = await messagesDB.deleteOne(parameter);
            return res.status(200).json({ messageD });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }
}

export default new MessagesController();

async function handleReceiver(res: Response, body: Partial<MessageRequest>, sender: IUser, session: ClientSession): Promise<Response> {
    const receiver: IUser | null = await usersdb.findOne({ _id: body.receiver as string });
    if (!receiver) return res.status(404).json({ error: 'Receiver não encontrado!' });
    const messageSent: IMessageSent = await messagesSentsDB.create(body, session);
    const message = await messagesDB.create(body, session);
    if (body.process) {
        const processState: IProcessState = await processStatesDB.createNewMessage({ _id: body.process as string }, sender, receiver, session);
        const processU = await processesDB.updateOne({ _id: body.process as string }, { user: null, receiver: receiver._id }, session);
        return res.status(201).json({ message, messageSent, processU, processState });
    } else {
        await session.commitTransaction();
        return res.status(201).json({ messageSent });
    }
}

async function handleSectionReceiver(res: Response, body: Partial<MessageRequest>, sender: IUser, session: ClientSession): Promise<Response> {
    session.startTransaction();
    const users: IUser[] | null = await usersdb.findAll({ section: body.section_receiver as string }, 'section', 'section');
    if (users?.length === 0) return res.status(404).json({ error: 'Nenhum user cadastrado nesta section ou section inválida!' });
    const messageSent: IMessageSent = await messagesSentsDB.create(body, session);
    for (const receiver of users as IUser[]) {
        await messagesDB.create({ ...body, receiver: receiver._id }, session);
    }
    if (body.process) {
        const processState: IProcessState = await processStatesDB.createNewMessage(
            { _id: body.process as string },
            sender,
            (users as IUser[])[0].section as Partial<IUser>,
            session
        );
        const processU = await processesDB.updateOne({ _id: body.process as string }, { user: undefined, section_receiver: body.section_receiver as string });
        await session.commitTransaction();
        return res.status(201).json({ messageSent, processU, processState });
    } else {
        await session.commitTransaction();
        return res.status(201).json({ messageSent });
    }
}
