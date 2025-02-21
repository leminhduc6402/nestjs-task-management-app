import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PriorityEnum, TaskStatusEnum } from 'src/common/enum';
import { User } from 'src/users/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: TaskStatusEnum })
  status: TaskStatusEnum;

  @Prop({ required: true, enum: PriorityEnum })
  priority: PriorityEnum;

  @Prop()
  tags: string;

  @Prop()
  startDate: Date;

  @Prop()
  dueDate: Date;

  @Prop()
  points: number;

  @Prop()
  projectId: string; // ref to project

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  assignedUser: mongoose.Schema.Types.ObjectId;

  @Prop()
  attachments: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: mongoose.Schema.Types.ObjectId; // ref: user

  @Prop()
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  updatedBy: mongoose.Schema.Types.ObjectId; // ref: user

  @Prop()
  deletedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  deletedBy: mongoose.Schema.Types.ObjectId; // ref: user

  @Prop({ default: false })
  isDeleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
