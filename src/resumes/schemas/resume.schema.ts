
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schema';
import { Jobs } from 'src/jobs/schemas/jobs.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true }) // tự động cập nhật createdAt và updatedAt
export class Resume {
    @Prop()
    email: string

    @Prop()
    userId: Types.ObjectId;

    @Prop()
    url: string;

    @Prop()
    status: string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: Company.name})
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: Jobs.name})
    jobId: mongoose.Schema.Types.ObjectId;

    @Prop({type: Array})
    history:{
        status: string,
        updatedAt: Date,
        updatedBy:{
            _id: mongoose.Schema.Types.ObjectId,
            email: string;
        } 
    }[]

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Object })
    createdBy: {
        _id: string,
        email: string
    }
    @Prop({ type: Object })
    updatedBy: {
        _id: string,
        email: string
    }
    @Prop({ type: Object })
    deletedBy: {
        _id: string,
        email: string
    }

}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
