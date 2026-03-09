
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true }) // tự động cập nhật createdAt và updatedAt
export class Resume {
    @Prop()
    email: string

    @Prop()
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string;

    @Prop()
    status: string

    @Prop()
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop()
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
