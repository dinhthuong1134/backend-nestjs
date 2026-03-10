import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose, { Types } from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;

    @IsNotEmpty({ message: "description không được để trống" })
    description: string;

    @IsNotEmpty({ message: "isActive không được để trống" })
    isActive: boolean;

    @IsArray({ message: "permission phải là mảng" })
    @ArrayNotEmpty({ message: "permission không được để trống" })
    @IsMongoId({ each: true, message: "mỗi permision phải là objectId" })
    permissions: mongoose.Schema.Types.ObjectId[];
}
