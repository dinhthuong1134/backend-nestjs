import { Injectable } from '@nestjs/common';
import { CreateCvResumeDto, CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import type { SoftDeleteModel } from 'mongoose-delete';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  async create(user: IUser, Cv: CreateCvResumeDto) {
    const { url, companyId, jobId } = Cv;
    let data = await this.resumeModel.create({
      url, companyId, jobId,
      status: "PENDING",
      history:[ {
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

  async updateStatus(id: string, user: IUser, status: string){
    let data = await this.resumeModel.updateOne({_id: id}, {
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
}
