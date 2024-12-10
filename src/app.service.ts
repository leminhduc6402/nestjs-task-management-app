import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configServire: ConfigService) {}
  getHello(): string {
    return `Hello Le Minh Duc`;
  }
}
