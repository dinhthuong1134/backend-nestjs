import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { Public, ResponseMessage, User } from 'src/users/decorator/customize';
import type { IUser } from 'src/users/users.interface';
import { CreateCvResumeDto } from './dto/create-resume.dto';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}


  @Post()
  @ResponseMessage('tạo mới cv thành công')
  handleCreateResume(@User() user: IUser, @Body() Cv: CreateCvResumeDto){
    return this.resumesService.create(user, Cv);
  }

  @Patch(':id')
  @ResponseMessage('cập nhật trạng thái thành công')
  handleUpdateResume(@Param('id') id: string, @User() user: IUser, @Body('status') status: string){
    return this.resumesService.updateStatus(id, user, status);
  }

  @Get()
  @ResponseMessage('get by all resume')
  handleGetAllResume(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs){
    return this.resumesService.getAllResume(+page, + limit, qs);
  }

  @Get(':id')
  @ResponseMessage('get one resume')
  handleGetOneResume(@Param('id') id: string){
    return this.resumesService.getOneResume(id);
  }


  @Delete(':id')
  @ResponseMessage('delete resume successfull')
  handleDeleteOneResume(@Param('id') id: string, @User() user: IUser){
    return this.resumesService.deleteOneResume(user, id);
  }

  @Post('by-user')
  @ResponseMessage('Công việc mà bạn đã nộp')
  handleGetJobsByUser(@User() user: IUser){
    return this.resumesService.getJobsByUser(user);
  }

}
