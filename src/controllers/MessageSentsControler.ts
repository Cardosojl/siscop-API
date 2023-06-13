import { Request, Response } from 'express';
import messageSentsDB, { IMessageSent } from '../models/MessagesSents';
import { MessageRequest } from '../types/types';
import { messageValidator } from '../config/validators';

class MessageSentsController {
    async index(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query as Partial<MessageRequest>;
            const { select, include, sort, limit, page } = query;
            const fields: (keyof IMessageSent)[] = messageSentsDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (queryValidation.length > 0) return res.status(400).json({ errors: queryValidation });
            param.forEach((element) => {
                element === '_id' || element === 'sender' || element === 'receiver' || element === 'process'
                    ? (parameter[element] = `${query[element]}`)
                    : (parameter[element] = new RegExp(`${query[element]}`, 'i'));
            });
            const messages: IMessageSent[] | null = await messageSentsDB.findAll(
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
            const fields: (keyof IMessageSent)[] = messageSentsDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido!' });
            if (queryValidation.length > 0) return res.status(400).json({ errors: queryValidation });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const message: IMessageSent | null = await messageSentsDB.findOne(parameter, select as string, include as string);
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
            const fields: (keyof IMessageSent)[] = messageSentsDB.fields();
            const parameter: Partial<MessageRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<MessageRequest>[] = messageValidator(query);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido' });
            if (queryValidation.length > 0) return res.status(400).json({ error: queryValidation });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const message: IMessageSent | null = await messageSentsDB.findOne(parameter);
            if (!message) return res.status(404).json({ error: 'Message não encontrada!' });
            const messageD = await messageSentsDB.deleteOne(parameter);
            return res.status(200).json({ messageD });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }
}

export default new MessageSentsController();
