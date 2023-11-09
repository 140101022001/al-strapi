import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose from 'mongoose';
import { CreateUserDto } from './schema/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  userTransferObject(user: any) {
    const userCopy = { ...user };
    delete userCopy._doc.password;
    delete userCopy._doc.createdAt;
    delete userCopy._doc.updatedAt;
    delete userCopy._doc.__v;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    users.map((user) => {
      this.userTransferObject(user);
    });
    return users;
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userModel.create(user);
      return newUser;
    } catch (err) {
      if (err.code == 11000) {
        throw new HttpException(
          'Duplicate email entered!',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException('Some thing error!', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new HttpException('Email does not exists!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
