import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import type { SoftDeleteModel } from 'mongoose-delete';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { Permission, PermissionDocument } from 'src/permission/schemas/permission.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSION, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name)
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
    private configServer: ConfigService,
    private userServer: UsersService,
  ) { }
  async onModuleInit() {
    const isFakeData = this.configServer.get<string>("SHOULD_INIT");
    if (Boolean(isFakeData)) {
      const countUser = await this.userModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});
      const countPermission = await this.permissionModel.countDocuments({});

      if (!countPermission) {
        await this.permissionModel.insertMany(INIT_PERMISSION);
      }

      if (!countUser) {
        const permissions = await this.permissionModel.find({}).select("_id");
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: "admin thì full quyền",
            isActive: true,
            permissions: permissions
          },
          {
            name: USER_ROLE,
            description: "người dùng sử dụng hệ thống",
            isActive: true,
            permissions: []
          }
        ])
      }

      if (!countUser) {
        const roleAdmin = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const roleUser = await this.roleModel.findOne({ name: USER_ROLE });

        await this.userModel.insertMany([
          {
            name: "Admin",
            email: "Admin@gmail.com",
            password: this.userServer.hashPassword("123456"),
            age: 28,
            gender: "MALE",
            address: "Ha Noi",
            role: roleAdmin?._id
          },
          {
            name: "Pham Dinh Thuong",
            email: "thuonglop94dhp@gmail.com",
            password: this.userServer.hashPassword("123456"),
            age: 24,
            gender: "FEMALE",
            address: "Da Nang",
            role: roleAdmin?._id
          },
          {
            name: "user",
            email: "user@gmail.com",
            password: this.userServer.hashPassword("123456"),
            age: 31,
            gender: "MALE",
            address: "Ho Chi Minh",
            role: roleUser?._id
          }
        ])
      }
      if(countPermission > 0 && countRole > 0 && countUser > 0){
        this.logger.log("DATA đã có rồi nhá");
      }
      console.log(this.configServer.get<string>("INIT_PASSWORD"));
    }
    
  }
}
