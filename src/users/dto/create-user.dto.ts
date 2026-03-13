import { Type } from 'class-transformer';
import {  IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, Matches, ValidateNested } from 'class-validator';
import mongoose, { Types } from 'mongoose';

class Company {
    _id: string;
    name: string;
}
export class CreateUserDto {
    
    @IsNotEmpty({message: "name không đúng định dạng"})
    name: string;

    @IsEmail({},{message: "email không đúng định dạng"})
    @IsNotEmpty()
    email: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    @IsNotEmpty({message: "password không đúng định dạng"})
    password: string;

    @IsNotEmpty({message: "age không đúng định dạng"})
    age: number;

    @IsNotEmpty({message: "gender không đúng định dạng"})
    gender: string;

    @IsNotEmpty({message: "address không đúng định dạng"})
    address: string;

    @IsNotEmpty({message: "role không đúng định dạng"})
    @IsMongoId({message: "role phải có định dạng là objectid"})
    role: Types.ObjectId;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}

export class RegisterUserDto {
    @IsNotEmpty({message: "name không đúng định dạng"})
    name: string;

    @IsEmail({},{message: "email không đúng định dạng"})
    @IsNotEmpty()
    email: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: "mật khẩu quá dễ"
    })
    @IsNotEmpty({message: "password không đúng định dạng"})
    password: string;

    @IsNotEmpty({message: "age không đúng định dạng"})
    age: number;

    @IsNotEmpty({message: "gender không đúng định dạng"})
    gender: string;

    @IsNotEmpty({message: "address không đúng định dạng"})
    address: string;
}
