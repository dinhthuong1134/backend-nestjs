import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCvResumeDto, CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import type { SoftDeleteModel } from 'mongoose-delete';
import mongoose, { Types } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  async create(user: IUser, Cv: CreateCvResumeDto) {
    const { url, companyId, jobId } = Cv;
    let data = await this.resumeModel.create({
      url, companyId, jobId,
      userId: user._id,
      status: "PENDING",
      history: [{
        status: "PENDING",
        updatedAt: new Date(),
        updatedBy: {
          _id: new mongoose.Schema.Types.ObjectId(user._id),
          email: user.email
        }
      }],
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: data._id,
      createdAt: data.createdAt
    }
  }

  async updateStatus(id: string, user: IUser, status: string) {
    let data = await this.resumeModel.updateOne({ _id: id }, {
      status,
      $push: {
        history:
        {
          status,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      },
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return data;
  }

  async getAllResume(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection} = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const defaultLimit = limit || 10;
    const offset = (currentPage - 1) * defaultLimit;

    const totalResume = await this.resumeModel.countDocuments(filter);
    const totalPage = Math.ceil(totalResume / defaultLimit);

    const result = await this.resumeModel
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
        total: totalResume
      },
      result
    };
  }

  async getOneResume(id: string){
    return await this.resumeModel.findById(id);
  }

  async deleteOneResume(user: IUser, id: string){
    const isResume = await this.resumeModel.findById(id);
    if(!isResume){
      throw new BadRequestException("Cv này không tồn tại");
    }
    await this.resumeModel.updateOne({_id: id}, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    await this.resumeModel.delete({_id: id});
  }

  async getJobsByUser(user: IUser){
    return this.resumeModel.find({
      userId: user._id,
    })
  }
}
