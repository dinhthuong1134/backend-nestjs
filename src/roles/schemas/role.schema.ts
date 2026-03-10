import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo, Types } from 'mongoose';
import { Permission } from 'src/permission/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true }) // tự động cập nhật createdAt và updatedAt
export class Role {
    @Prop()
    name: string

    @Prop()
    description: string;

    @Prop()
    isActive: boolean;

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: Permission.name})
    permissions: mongoose.Schema.Types.ObjectId[];

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

export const RoleSchema = SchemaFactory.createForClass(Role);
