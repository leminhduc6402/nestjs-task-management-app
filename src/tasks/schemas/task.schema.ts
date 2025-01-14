import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/common/BaseSchema';
import { PriorityEnum, TaskStatusEnum } from 'src/common/enum';
import { User } from 'src/users/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task extends BaseSchema {
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

  // @Prop()
  // comments: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
