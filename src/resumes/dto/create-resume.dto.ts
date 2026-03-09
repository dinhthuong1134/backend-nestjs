import { IsEmail, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsEmail({}, {message: "phải đúng định dạng là email"})
    @IsNotEmpty({message: "email không được để trống"})
    email: string

    @IsMongoId({message: "id phải có đúng định dạng của mongod"})
    @IsNotEmpty({message: "userId không được để trống"})
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: "url không được để trống"})
    url: string;

    @IsNotEmpty({message: "url không được để trống"})
    status: string

    @IsMongoId({message: "id phải có đúng định dạng của mongod"})
    @IsNotEmpty({message: "companyId không được để trống"})
    companyId: mongoose.Schema.Types.ObjectId;

    @IsMongoId({message: "id phải có đúng định dạng của mongod"})
    @IsNotEmpty({message: "jobId không được để trống"})
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateCvResumeDto {
    @IsNotEmpty({message: "url không được để trống"})
    url: string;

    @IsMongoId({message: "id phải có đúng định dạng của mongod"})
    @IsNotEmpty({message: "companyId không được để trống"})
    companyId: mongoose.Schema.Types.ObjectId;

    @IsMongoId({message: "id phải có đúng định dạng của mongod"})
    @IsNotEmpty({message: "jobId không được để trống"})
    jobId: mongoose.Schema.Types.ObjectId;
}
