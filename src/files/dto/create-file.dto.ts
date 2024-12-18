import { IsEmpty } from 'class-validator';

export class CreateFileDto {
  @IsEmpty()
  originalname: string;

  @IsEmpty()
  mimetype: string;

  @IsEmpty()
  size: number;

  @IsEmpty()
  path: string;
}
