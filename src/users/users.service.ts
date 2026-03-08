import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import type { SoftDeleteModel } from 'mongoose-delete';
import type { IUser } from './users.interface';
import aqp from 'api-query-params';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}
  
  hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
  async create(data: CreateUserDto) {
    const hashPassword = this.hashPassword(data.password);
    let user = this.userModel.create({
      email: data.email,
      password: hashPassword,
      name: data.name
    })
    return user;
  }

  async register(data: RegisterUserDto) {
    const hashPassword = this.hashPassword(data.password);
    let user = await this.userModel.create({
        email: data.email,
        password: hashPassword,
        name: data.name,
        age: data.age,
        gender: data.gender,
        address: data.address,
        role: 'User'
    })
    return {
        _id: user?._id,
        createAt: user?.createdAt
    }
    // Nên chuyển sang userService để làm
}

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population} = aqp(qs);
    delete filter.page;
    delete filter.limit;
    let offset = (currentPage - 1)*limit;
    let defaultLimit = limit ? limit : 10;
    let totalCompany = (await this.userModel.find(filter)).length;
    let totalPage = Math.ceil(totalCompany/defaultLimit);
    const result = await this.userModel.find(filter)
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
        total: totalCompany
      },
      result
    }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id) ) return {message: "Không tìm thấy user này"};
    return await this.userModel.findOne({
      _id: id,
    }).select("-password");
  }

  async isUser(email: string) {
    return await this.userModel.findOne({
      email: email
    })
  }

  async isPassWord(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async update(data: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne(
      {_id: data._id},
      {
        ...data,
        updatedBy : {
          _id: user._id,
          email: user.email
        }
      }
    )
    return updated;
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)) return {message: "Không tìm thấy user này"};
    await this.userModel.updateOne(
      {_id: id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return await this.userModel.delete({_id: id});
  }
  async createUser(data: CreateUserDto, user: IUser){
    const isEmailExist = await this.userModel.findOne({email: data.email});
    if(isEmailExist){
      throw new BadRequestException(`email ${data.email} này đã tồn tại`);
    }

    const newPassWord = this.hashPassword(data.password);

    let newUser = await this.userModel.create({
      name: data.name,
      email: data.email,
      password: newPassWord,
      age: data.age,
      gender: data.gender,
      address: data.address,
      role: data.role,
      company: data.company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newUser._id,
      createAt: newUser.createdAt
    }
  }
  updateToken = async (refreshToken: string | null, _id: string) => {
    return await this.userModel.updateOne(
      {_id},
      {refreshToken}
    )
  }

  findUserByRefreshToken = async (refreshToken: string) => {
    let user = await this.userModel.findOne({refreshToken});
    return user;
  }
}
