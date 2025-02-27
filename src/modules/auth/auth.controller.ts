import { Controller, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'; // Import LocalAuthGuard
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { sendResponse } from 'src/common/responses/send-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard) // Use LocalAuthGuard for login
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({ status: 200, description: 'Login successful. Returns a JWT token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid credentials.' })
  async login(@Request() req, @Body() loginDto: CreateAuthDto) {
    return this.authService.login(req.user);
  }
  // async login(@Body() loginDto: CreateAuthDto, @Res() res: Response) {
  //   const result = await this.authService.login(loginDto);

  //   // Set refresh token in cookie
  //   res.cookie('refreshToken', result.refreshToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //   });

  //   sendResponse(res, {
  //     statusCode: 200,
  //     success: true,
  //     message: 'User logged in successfully!',
  //     data: { accessToken: result.accessToken },
  //   });
  // }
}