import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import type { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/users/users.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import aqp from 'api-query-params';
import { identity } from 'rxjs';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  async createRole(user: IUser, role: CreateRoleDto) {
    const { name, description, isActive, permissions } = role;
    let isName = await this.roleModel.findOne({ name: name });
    if (isName) {
      throw new BadRequestException(`role với name = ${name} này đã tồn tại`)
    }
    let data = await this.roleModel.create({
      name, description, isActive, permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: data._id,
      createAt: data.createdAt
    }
  }

  async updateRole(id: string, user: IUser, role: UpdateRoleDto) {
    let isName = await this.roleModel.findOne({ name: role.name });
    if (isName) {
      throw new BadRequestException(`role với name = ${role.name} này đã tồn tại`)
    }
    return await this.roleModel.updateOne({ _id: id }, {
      ...role,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async getAllRole(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const defaultLimit = limit || 10;
    const offset = (currentPage - 1) * defaultLimit;

    const totalRole = await this.roleModel.countDocuments(filter);
    const totalPage = Math.ceil(totalRole / defaultLimit);

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPage,
        total: totalRole
      },
      result
    };
  }

  async getOneRole(id: string) {

    return (await this.roleModel.findById(id))
      ?.populate({ path: "permissions", select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1} }) // = 1 là lầy -1 là ko lấy
  }

  async deleteOneRole(id: string, user: IUser) {
    const foundRole = await this.roleModel.findById(id);
    if(foundRole?.name === "ADMIN"){
      throw new BadRequestException("không thể xoá role admin")
    }
    await this.roleModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    await this.roleModel.delete({ _id: id });
  }
}
