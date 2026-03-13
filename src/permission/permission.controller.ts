import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ResponseMessage, User } from 'src/core/decorator/customize';
import type { IUser } from 'src/users/users.interface';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ResponseMessage("create a permission")
  handleCreatePermission(@Body() permission: CreatePermissionDto, @User() user: IUser){
    return this.permissionService.createPermission(permission, user);
  }

  @Get()
  @ResponseMessage("get all permission")
  handleGetAllPermission(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs){
    return this.permissionService.getAllPermission(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("get by id")
  handleGetOnePermission(@Param('id') id: string){
    return this.permissionService.getOnePermission(id);
  }

  @Patch(':id')
  @ResponseMessage("update susscesfull")
  handleUpdatePermission(@Param('id') id: string, @Body() permission: UpdatePermissionDto, @User() user: IUser){
    return this.permissionService.updatePermission(id, permission, user);
  }

  @Delete(':id')
  @ResponseMessage("delete susscesfull")
  handleDeletePermission(@Param('id') id: string, @User() user: IUser){
    return this.permissionService.deletePermission(id, user);
  }
  
}
