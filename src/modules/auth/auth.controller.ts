import { Controller, Post, Body, UseGuards, Request, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'; // Import LocalAuthGuard
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { sendResponse } from 'src/common/responses/send-response';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService,) { }

  @UseGuards(LocalAuthGuard) // Use LocalAuthGuard for login
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({ status: 200, description: 'Login successful. Returns a JWT token.' })
  async login(@Body() loginDto: CreateAuthDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);

    // Set refresh token in cookie
    const cookieOptions = {
      secure: this.configService.get<string>('NODE_ENV') === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    };

    res.cookie('refreshToken', result.refresh_token, cookieOptions);


    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User logged in successfully!',
      data: result,
    });
  }
}