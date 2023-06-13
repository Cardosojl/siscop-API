import { Request, Response } from 'express';
import processStatesDB, { IProcessState } from '../models/ProcessStates';
import { ProcessStateRequest } from '../types/types';
import { processStateValidator } from '../config/validators';

class ProcessStatesController {
    async store(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body as Partial<ProcessStateRequest>;
            const bodyValidation: Partial<ProcessStateRequest>[] = processStateValidator(body);
            if (bodyValidation.length > 0) return res.status(400).json({ errors: bodyValidation });
            const state: IProcessState = await processStatesDB.create(body);
            return res.status(201).json({ state });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query as Partial<ProcessStateRequest>;
            const { select, include, sort, limit, page } = query;
            const fields: (keyof IProcessState)[] = processStatesDB.fields();
            const parameter: Partial<ProcessStateRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<ProcessStateRequest>[] = processStateValidator(query);
            if (queryValidation.length > 0) return res.status(400).json({ errors: queryValidation });
            param.forEach((element) => {
                element === '_id' || element === 'process' || element === 'user'
                    ? (parameter[element] = `${query[element]}`)
                    : (parameter[element] = new RegExp(`${query[element]}`, 'i'));
            });
            // eslint-disable-next-line prettier/prettier
            const states: IProcessState[] | null = await processStatesDB.findAll(parameter, select as string, include as string, sort as string, limit as number, page as number);
            if (states?.length === 0) return res.status(404).json({ error: 'ProcessState não encontrado!' });
            return res.status(200).json({ states });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query as Partial<ProcessStateRequest>;
            const { select, include } = query;
            const fields: (keyof IProcessState)[] = processStatesDB.fields();
            const parameter: Partial<ProcessStateRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<ProcessStateRequest>[] = processStateValidator(query);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido!' });
            if (queryValidation.length > 0) return res.status(400).json({ errors: queryValidation });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const state: IProcessState | null = await processStatesDB.findOne(parameter, select as string, include as string);
            if (!state) return res.status(400).json({ error: 'ProcessState não encontrado!' });
            return res.status(200).json({ state });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query as Partial<ProcessStateRequest>;
            const body = req.body as Partial<ProcessStateRequest>;
            const fields: (keyof IProcessState)[] = processStatesDB.fields();
            const parameter: Partial<ProcessStateRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<ProcessStateRequest>[] = processStateValidator(query);
            const bodyValidation: Partial<ProcessStateRequest>[] = processStateValidator(body);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido!' });
            if (queryValidation.length > 0 || bodyValidation.length > 0) return res.status(400).json({ errors: queryValidation.concat(bodyValidation) });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const state: IProcessState | null = await processStatesDB.findOne(parameter);
            if (!state) return res.status(404).json({ error: 'ProcessState não encontrado!' });
            const stateU = await processStatesDB.updateOne(parameter, body);
            return res.status(200).json({ stateU });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query as Partial<ProcessStateRequest>;
            const fields: (keyof IProcessState)[] = processStatesDB.fields();
            const parameter: Partial<ProcessStateRequest> = {};
            const param = fields.filter((element) => Object.keys(query).includes(element));
            const queryValidation: Partial<ProcessStateRequest>[] = processStateValidator(query);
            if (param.length === 0) return res.status(400).json({ error: 'Parâmetro inválido!' });
            if (queryValidation.length > 0) return res.status(400).json({ error: queryValidation });
            param.forEach((element) => (parameter[element] = `${query[element]}`));
            const state: IProcessState | null = await processStatesDB.findOne(parameter);
            if (!state) return res.status(404).json({ error: 'ProcessState não encontrado!' });
            const stateD = await processStatesDB.deleteOne(parameter);
            return res.status(200).json({ stateD });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: (error as Record<string, string>).message });
        }
    }
}

export default new ProcessStatesController();