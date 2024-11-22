import {
  Controller,
  Post,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { SUCCESS_STATUS } from 'src/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin')
  async createAdmin(@Body() body: { email: string; password: string }) {
    try {
      const data = await this.authService.createAdmin(body);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success create account',
        },
      };
    } catch (error) {
      throw error;
    }
  }
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const { data } = await this.authService.login(
        body.email,
        body.password,
      );
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: 'success login',
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
