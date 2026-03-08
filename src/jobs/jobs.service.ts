import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Jobs, JobsDocument } from './schemas/jobs.schema';
import { InjectModel } from '@nestjs/mongoose';
import type { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name) private jobModel: SoftDeleteModel<JobsDocument>
  ) { }

  async createJob(job: CreateJobDto, user: IUser) {
    let jobs = await this.jobModel.create({
      name: job.name,
      skills: job.skills,
      company: job.company,
      location: job.location,
      salary: job.salary,
      quantity: job.quantity,
      level: job.level,
      description: job.description,
      startDate: job.startDate,
      endDate: job.endDate,
      isActive: job.isActive,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });

    return {
      _id: jobs?._id,
      createAt: jobs.createdAt
    }
  }

  async updateJob(id: string, data: UpdateJobDto, user: IUser) {
    return await this.jobModel.updateOne(
      { _id: id },
      {
        ...data,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
  }

  async deleteJob(id: string, user: IUser) {
    await this.jobModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          name: user.name
        }
      }
    )
    await this.jobModel.delete({ _id: id });
  }

  async getJob(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      return "job này không tồn tại";
    }
    let job = await this.jobModel.findOne({ _id: id });
    return {
      job
    }
  }

  async getAllJob(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    let totalJob = (await this.jobModel.find(filter)).length;
    let totalPage = Math.ceil(totalJob / defaultLimit);
    const result = await this.jobModel.find(filter)
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
        total: totalJob
      },
      result
    }
  }
}
