import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true }) // tự động cập nhật createdAt và updatedAt
export class Permission {
    @Prop()
    name: string

    @Prop()
    apiPath: string;

    @Prop()
    method: string

    @Prop()
    module: string;

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);
