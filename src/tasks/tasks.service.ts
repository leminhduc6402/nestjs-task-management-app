import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: IUser) {
    const { description, points, assignedUser, attachments, ...taskInfo } =
      createTaskDto;
    console.log(taskInfo);
    const newTask = await this.taskModel.create({
      ...taskInfo,
      points: points || 0,
      description: description || '',
      assignedUser: assignedUser || '',
      attachments: attachments || '',
      createdBy: user._id,
      isDeleted: false,
    });
    return newTask;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.taskModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.taskModel
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
    return `This action returns a #${id} task`;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: IUser) {
    return await this.taskModel.findByIdAndUpdate(
      { _id: id },
      { ...updateTaskDto, updatedBy: user._id },
      { new: true },
    );
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new NotFoundException('Invalid ID');
    }
    return await this.taskModel.findOneAndUpdate(
      { _id },
      {
        isDeleted: true,
        deletedBy: user._id,
        deletedAt: new Date(),
      },
      { new: true },
    );
  }

  async updateTaskStatus(taskId: string, status: string) {
    const isExist = await this.taskModel.findOne({
      _id: taskId,
      isDeleted: true,
    });
    if (isExist) {
      throw new BadRequestException('Task does not exist or has been deleted.');
    }
    return await this.taskModel.findByIdAndUpdate(
      { _id: taskId },
      { status },
      { new: true },
    );
  }

  async getUserTasks(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Can not found this user');
    }
    const tasks = await this.taskModel.find({
      $or: [{ assignedUser: { $in: userId } }, { createdBy: { $in: userId } }],
    });
    return tasks;
  }
}
