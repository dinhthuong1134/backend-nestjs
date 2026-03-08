import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { Company } from "src/companies/schemas/company.schema";

export class CreateJobDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;

    @IsArray({ message: "skills phải là mảng" })
    @ArrayNotEmpty({ message: "skills không được để trống" })
    @IsString({ each: true, message: "mỗi skill phải là string" })
    skills: string[];

    @IsNotEmpty({ message: "company không được để trống" })
    company: Company;

    @IsNotEmpty({ message: "location không được để trống" })
    location: string;

    @IsNotEmpty({ message: "salary không được để trống" })
    salary: number;

    @IsNotEmpty({ message: "quantity không được để trống" })
    quantity: number;

    @IsNotEmpty({ message: "level không được để trống" })
    level: string;

    @IsNotEmpty({ message: "description không được để trống" })
    description: string;

    @IsNotEmpty({ message: "startDate không được để trống" })
    @Type(() => Date)
    @IsDate({ message: "startDate phải đúng định dạng Date" })
    startDate: Date;

    @IsNotEmpty({ message: "endDate không được để trống" })
    @Type(() => Date)
    @IsDate({ message: "endDate phải đúng định dạng Date" })
    endDate: Date;

    @IsNotEmpty({ message: "isActive không được để trống" })
    isActive: boolean;

}
