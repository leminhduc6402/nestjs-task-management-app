import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/user.interface';
import { File } from './schemas/file.schema';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  async create(file: Express.Multer.File, user: IUser) {
    const { _id } = user;
    const { filename, mimetype, path, size, originalname } = file;
    return await this.fileModel.create({
      name: filename,
      originalName: originalname,
      mimeType: mimetype,
      size: size,
      path: path,
      updatedBy: _id,
      createdBy: _id,
      isDelete: false,
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.fileModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.fileModel
      .find(filter)
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

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new NotFoundException('Can not found this file');
    }
    const file = await this.fileModel.findByIdAndUpdate(
      { _id },
      {
        isDelete: true,
        deletedAt: new Date(),
        deletedBy: user._id,
      },
      { new: true },
    );
    return file;
  }
}
