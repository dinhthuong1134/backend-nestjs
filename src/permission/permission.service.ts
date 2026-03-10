import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import type { SoftDeleteModel } from 'mongoose-delete';
import aqp from 'api-query-params';

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }

  async createPermission(permission: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = permission;
    let isPermission = await this.permissionModel.findOne({ apiPath, method });

    if (isPermission) {
      throw new BadRequestException(`permission với api ${apiPath} và method ${method} này đã tồn tại`)
    }
    let data = await this.permissionModel.create({
      name, apiPath, method, module,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: data._id,
      createdAt: data.createdAt
    }
  }

  async getAllPermission(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const defaultLimit = limit || 10;
    const offset = (currentPage - 1) * defaultLimit;

    const totalPermission = await this.permissionModel.countDocuments(filter);
    const totalPage = Math.ceil(totalPermission / defaultLimit);

    const result = await this.permissionModel
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
        total: totalPermission
      },
      result
    };
  }

  async getOnePermission(id: string) {
    return await this.permissionModel.find({ _id: id });
  }

  async updatePermission(id: string, permission: UpdatePermissionDto, user: IUser) {
    return await this.permissionModel.updateOne({ _id: id },
      {
        ...permission,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
  }

  async deletePermission(id: string, user: IUser){
    await this.permissionModel.updateOne(
      {_id: id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    await this.permissionModel.delete({_id: id});
  }
}
