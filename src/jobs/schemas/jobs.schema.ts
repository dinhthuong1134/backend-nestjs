import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type JobsDocument = HydratedDocument<Jobs>;

@Schema({ timestamps: true })
export class Jobs {
    @Prop()
    name: string;

    @Prop()
    skills: string[];

    @Prop({type: Object})
    company: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string
    };

    @Prop()
    location: string;

    @Prop()
    salary: number;

    @Prop()
    quantity: number;

    @Prop()
    level: string;

    @Prop()
    description: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    isActive: boolean;

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

export const JobsSchema = SchemaFactory.createForClass(Jobs);
