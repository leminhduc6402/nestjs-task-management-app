import { IsEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsEmpty()
  name: string;

  description: string;

  @IsEmpty()
  startDate: Date;

  @IsEmpty()
  endDate: Date;
}
