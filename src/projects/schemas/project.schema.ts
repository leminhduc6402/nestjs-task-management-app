import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/common/BaseSchema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
