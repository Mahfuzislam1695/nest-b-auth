import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ApiError } from 'src/common/errors/api-error';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new ApiError(HttpStatus.CONFLICT, 'User does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(HttpStatus.CONFLICT, 'Password is incorrect');
    }

    const { password: _, ...result } = user; // Exclude password from the result
    return result;
  }

  async login(loginDto: CreateAuthDto) {
    const { email, password } = loginDto;

    // Validate user credentials
    const user = await this.validateUser(email, password);

    // const payload = { email: user.email, sub: user.id, role: user.role };

    // const accessToken = this.jwtService.sign(payload, {
    //   secret: this.configService.get<string>('JWT_SECRET'),
    //   expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    // });

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    // Generate refresh token with role
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if the user exists using findByEmail
      const user = await this.usersService.findByEmail(payload.email); // Use findByEmail
      if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'User does not exist');
      }

      // Generate a new access token with role
      const accessToken = this.jwtService.sign(
        { email: user.email, sub: user.id, role: user.role }, // Include role in payload
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      );

      // Generate a new refresh token with role (optional)
      const refreshToken = this.jwtService.sign(
        { email: user.email, sub: user.id, role: user.role }, // Include role in payload
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      );

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'Invalid or expired refresh token');
    }
  }
}
