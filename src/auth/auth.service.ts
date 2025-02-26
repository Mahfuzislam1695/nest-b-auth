import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // * Sign Up

  async signup(dto: AuthDto) {
    // ? generate the password hash

    const hash = await argon.hash(dto.password);

    // ? save the new user in db

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          firstName: true,
          lastName: true,
        },
      });

      // ? return the saved user

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  // * Sign In

  async signin(dto: AuthDto) {
    // ? Find the user by email

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // ? if user doesn't not exist, throw exception

    if (!user) throw new ForbiddenException('credentials incorrect');

    // ? Compare password

    const pwMatches = await argon.verify(user.hash, dto.password);

    // ? If password is incorrect, throw exception
    if (!pwMatches) throw new ForbiddenException('credentials incorrect');

    // ? send back the user

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const secret = this.config.get('JWT_SECRET');

    const payload = {
      sub: userId,
      email,
    };

    const options = {
      expiresIn: '15m',
      secret: secret,
    };

    const token = await this.jwt.signAsync(payload, options);

    return {
      access_token: token,
    };
  }
}
