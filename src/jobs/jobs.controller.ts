import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import type { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, User } from 'src/core/decorator/customize';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage("get user")
  @Get(':id')
  handleGetJob(@Param('id') id: string){
    return this.jobsService.getJob(id);
  }

  @Public()
  @ResponseMessage("get all user")
  @Get()
  handleGetAllJob(@Query('page') page: number, @Query('limit') limit: number, @Query() qs){
    return this.jobsService.getAllJob(page, limit, qs);
  }

  @ResponseMessage("tạo mới job thành công")
  @Post()
  createNewJobs(@Body() job: CreateJobDto, @User() user: IUser){
    return this.jobsService.createJob(job, user);
  }

  @ResponseMessage("cập nhật job thành công")
  @Patch(':id')
  updateJobs(@Param('id') id: string, @Body() updateJob: UpdateJobDto, @User() user: IUser){
    return this.jobsService.updateJob(id, updateJob, user);
  }

  @ResponseMessage("Xoá job thành công")
  @Delete(':id')
  deleteJobs(@Param('id') id: string, @User() user: IUser){
    return this.jobsService.deleteJob(id, user);
  }
}
