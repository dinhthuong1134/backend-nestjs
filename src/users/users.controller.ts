import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from '../core/decorator/customize';
import type { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  findAll(@Query("page") currentPage: string,
          @Query("limit") limit: string,
          @Query() qs: string        
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ResponseMessage("Tạo mới người dùng thành công")
  async createNewUser(@Body() createUser: CreateUserDto, @User() user: IUser){
    return this.usersService.createUser(createUser, user);
  }
  @Patch()
  @ResponseMessage("Cập nhập user thành công")
  async update(@Body() updateUser: UpdateUserDto, @User() user: IUser){
    await this.usersService.update(updateUser, user)
    return updateUser;
  }
  @Delete(':id')
  @ResponseMessage("Xoá user thành công")
  async remove(@Param('id') id: string, @User() user: IUser){
    await this.usersService.remove(id, user);
  }
}
