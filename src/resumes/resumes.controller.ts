import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResponseMessage, User } from 'src/users/decorator/customize';
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

}
