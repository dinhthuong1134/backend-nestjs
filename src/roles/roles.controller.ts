import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/users/decorator/customize';
import type { IUser } from 'src/users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage("tạo mới role thành công")
  handleCreateRole(@User() user: IUser, @Body() role: CreateRoleDto){
    return this.rolesService.createRole(user, role);
  }

  @Patch(':id')
  @ResponseMessage("update role thành công")
  handleUpdateRole(@Param('id') id: string, @User() user: IUser, @Body() role: UpdateRoleDto){
    return this.rolesService.updateRole(id, user, role);
  }

  @Get()
  @ResponseMessage("get all role")
  handleGetAllRole(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs ){
    return this.rolesService.getAllRole(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("get role by id")
  handleGetOneRole(@Param('id') id: string){
    return this.rolesService.getOneRole(id);
  }

  @Delete(':id')
  @ResponseMessage("delete sussesfull")
  handleDeleteOneRole(@Param('id') id: string, @User() user: IUser){
    return this.rolesService.deleteOneRole(id, user);
  }

}
