import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import type { SoftDeleteModel } from 'mongoose-delete';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import { create } from 'node:domain';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {

  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population} = aqp(qs);
    delete filter.page;
    delete filter.limit;
    let offset = (currentPage - 1)*limit;
    let defaultLimit = limit ? limit : 10;
    let totalCompany = (await this.companyModel.find(filter)).length;
    let totalPage = Math.ceil(totalCompany/defaultLimit);
    const result = await this.companyModel.find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any)
        .populate(population)
        .exec()
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPage,
        total: totalCompany
      },
      result
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto, updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    await this.companyModel.delete({
      _id: id
    });
  }
}
