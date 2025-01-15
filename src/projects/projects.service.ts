import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: IUser) {
    const project = await this.projectModel.create({
      ...createProjectDto,
      createdBy: user._id,
      isDeleted: false,
    });
    return project;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.projectModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.projectModel
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

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return updateProjectDto;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new NotFoundException('Invalid ID');
    }
    return await this.projectModel.findOneAndUpdate(
      { _id },
      {
        isDeleted: true,
        deletedBy: user._id,
        deletedAt: new Date(),
      },
      { new: true },
    );
  }
}
