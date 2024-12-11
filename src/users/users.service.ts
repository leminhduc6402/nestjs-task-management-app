import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, active, avatar } = createUserDto;

    const isEmailValid = await this.userModel.findOne({ email });
    if (isEmailValid) {
      throw new BadRequestException(`Email: ${email} already exists`);
    }
    const hashPassword = this.hashPassword(password);

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      active,
      avatar,
    });
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.userModel
      .find(filter)
      .select('-password -refreshToken')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      results,
    };
  }

  async findOne(_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new NotFoundException('Can not found this user');
    }
    const user = await this.userModel
      .findById(_id)
      .select('-password -refreshToken');

    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    const { _id, active, avatar, email, name } = updateUserDto;

    const checkValidEmail = await this.userModel.findOne({ email });
    if (checkValidEmail) {
      throw new BadRequestException(`Email: ${email} already exists`);
    }

    return await this.userModel.findByIdAndUpdate(
      { _id },
      { active, avatar, email, name },
      { new: true },
    );
  }

  async remove(_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new NotFoundException('Not Found User');
    }
    return await this.userModel.findOneAndUpdate(
      { _id },
      {
        isDeleted: true,
      },
      { new: true },
    );
  }
}
