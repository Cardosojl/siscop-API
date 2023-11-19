import mongoose, { Schema, Types, UpdateWriteOpResult, mongo } from 'mongoose';
import { SectionRequest } from '../types/types';

export interface ISection {
    _id?: string | Types.ObjectId;
    name: string;
    level: number;
}

async function nameValidator(value: string): Promise<boolean> {
    try {
        const user: ISection | null = await mongoose.model('section').findOne({ name: value });
        if (user) {
            return false;
        }
        return true;
    } catch (error) {
        throw new Error(error as string);
    }
}

const section = new Schema<ISection>({
    name: {
        type: String,
        required: [true, 'Nome é um campo obrigatório!'],
        unique: true,
        validate: {
            validator: nameValidator,
            message: 'Este nome já possuí cadastro!',
        },
    },
    level: {
        type: Number,
        required: [true, 'Level é um campo obrigatório!'],
    },
});

const sectionModel = mongoose.model<ISection>('section', section);

class Sections {
    async create(body: Partial<SectionRequest>): Promise<ISection> {
        try {
            const section: ISection = await new sectionModel(body).save();
            return section;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async findAll(parameter: Partial<SectionRequest>, select = '', limit = 0, page = 0): Promise<ISection[] | null> {
        try {
            const result: ISection[] | null = await sectionModel
                .find(parameter)
                .select(select)
                .skip(limit * page)
                .limit(limit);
            return result;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async findOne(parameter: Partial<SectionRequest>, select = ''): Promise<ISection | null> {
        try {
            const result: ISection | null = await sectionModel.findOne(parameter).select(select);
            return result;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async updateOne(parameter: Partial<SectionRequest>, body: Partial<SectionRequest>): Promise<UpdateWriteOpResult> {
        try {
            const section: UpdateWriteOpResult = await sectionModel.updateOne(parameter, { $set: body }, { runValidators: true });
            return section;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    async deleteOne(parameter: Partial<SectionRequest>): Promise<mongo.DeleteResult> {
        try {
            const section: mongo.DeleteResult = await sectionModel.deleteOne(parameter);
            return section;
        } catch (error) {
            throw new Error(error as string);
        }
    }

    fields(): (keyof ISection)[] {
        try {
            const fields = Object.values(sectionModel.schema.paths).map((element) => element.path as keyof ISection);
            return fields;
        } catch (error) {
            throw new Error(error as string);
        }
    }
}

export default new Sections();
