import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/user.interface';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ResponseMessage('Upload single file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileLocal(
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return this.filesService.create(file, user);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.filesService.findAll(+currentPage, +limit, qs);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.filesService.remove(id, user);
  }
}
