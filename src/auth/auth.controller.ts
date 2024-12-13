import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Request as Req } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public, ResponseMessage } from 'src/customDecorator/customize';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMessage('Login Success')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Request() request: Req,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() request: Req) {
    return request.user;
  }
}
