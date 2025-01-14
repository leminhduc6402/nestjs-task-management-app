import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class BaseSchema {
  @Prop()
  createdAt: Date;

  @Prop()
  createdBy: mongoose.Schema.Types.ObjectId; // ref: user

  @Prop()
  updatedAt: Date;

  @Prop()
  updatedBy: mongoose.Schema.Types.ObjectId; // ref: user

  @Prop()
  deletedAt: Date;

  @Prop()
  deletedBy: mongoose.Schema.Types.ObjectId; // ref: user

  @Prop({ default: false })
  isDeleted: boolean;
}
