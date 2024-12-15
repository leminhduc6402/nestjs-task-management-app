import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      if (user.active === false) {
        throw new ForbiddenException();
      }
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  async login(user: IUser, response: Response) {
    const { _id, email, name, avatar } = user;
    const payload = {
      sub: 'Token Login',
      iss: 'From Server',
      _id,
      name,
      email,
    };
    const refresh_token = this.createRefreshToken(payload);

    //update user with refresh token
    await this.usersService.updateUserToken(refresh_token, _id);

    // set refresh_token as cookies
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      sameSite: 'none',
      secure: true,
    });
    response.status(200);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        avatar,
      },
    };
  }

  processNewToken = async (refreshToken: string, response: Response) => {
    this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
    });
    const user = await this.usersService.findUserByToken(refreshToken);
    if (user) {
      //update refresh token
      const { _id, email, name, avatar } = user;
      const payload = {
        sub: 'token refresh',
        iss: 'from server',
        _id,
        name,
        email,
      };
      const refresh_token = this.createRefreshToken(payload);

      //update user with refresh token
      await this.usersService.updateUserToken(refresh_token, _id.toString());

      // set refresh_token as cookies
      response.clearCookie('refresh_token');

      response.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        sameSite: 'none',
        secure: true,
      });
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id,
          name,
          email,
          avatar,
        },
      };
    } else {
      throw new BadRequestException(`Refresh token invalid`);
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'Logout success';
  };
}
