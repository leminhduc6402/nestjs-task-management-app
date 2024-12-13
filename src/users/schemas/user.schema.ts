import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  active: boolean;

  @Prop()
  avatar: string;

  @Prop()
  createdAt: Date;

  @Prop()
  createdBy: string; // ref: user

  @Prop()
  updatedAt: Date;

  @Prop()
  updatedBy: string; // ref: user

  @Prop()
  deletedAt: Date;

  @Prop()
  deletedBy: string; // ref: user

  @Prop()
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
