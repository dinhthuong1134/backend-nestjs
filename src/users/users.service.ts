import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import bcrypt from "bcryptjs";
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
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

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) return "không tìm thấy user này";
    return await this.userModel.findOne({
      _id: id
    })
  }

  async isUser(email: string) {
    return await this.userModel.findOne({
      email: email
    })
  }

  async isPassWord(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id: id}, {...updateUserDto});
  }

  async remove(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) return "không tìm thấy user này";
    return await this.userModel.deleteOne({_id: id});
  }
}
