import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomError } from 'src/utils/customError';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email },  });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      const payload = { username: user.email, sub: user.id, role: user.role };
      const token = this.jwtService.sign(payload, { secret: 'heavenshell' });
      return {
        data: {
          ...result,
          access_token: token,
        },
      };
    }
    throw new CustomError('Invalid email or password', 401);
  }

  async createAdmin(body: { email: string; password: string }) {
    const bcrypt = require('bcryptjs');
    const password = bcrypt.hashSync(body.password, 10);
    await this.prisma.user.create({
      data: {
        email: body.email,
        password,
        role: 'admin',
      },
    });
  }
}
