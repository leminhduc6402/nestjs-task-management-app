import { IsEnum, IsNotEmpty } from 'class-validator';
import { PriorityEnum, TaskStatusEnum } from 'src/common/enum';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatusEnum)
  status: string;

  @IsNotEmpty()
  @IsEnum(PriorityEnum)
  priority: string;

  @IsNotEmpty()
  tags: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  dueDate: Date;

  points: number;

  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  assignedUser: string;

  attachments: string;
}
