import { Controller, Post, Body, UseGuards, Request, Res, HttpStatus, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'; // Import LocalAuthGuard
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { sendResponse } from 'src/common/responses/send-response';
import { ConfigService } from '@nestjs/config';
import { ApiError } from 'src/common/errors/api-error';
import { CustomRequest } from 'src/common/interfaces/request.interface';

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

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCookieAuth('refreshToken') // Indicate that this endpoint requires a refresh token cookie
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
  async refreshToken(@Req() req: CustomRequest, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    // const refreshToken = (req as any).cookies['refreshToken'];

    // console.log("refreshToken", refreshToken);


    if (!refreshToken) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Refresh token not found');
    }

    const result = await this.authService.refreshToken(refreshToken);

    // Set refresh token in cookie
    // const cookieOptions = {
    //   secure: this.configService.get<string>('NODE_ENV') === 'production', // Use secure cookies in production
    //   httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    // };

    // res.cookie('refreshToken', result.refresh_token, cookieOptions);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Access token refreshed successfully!',
      data: { access_token: result.access_token },
    });
  }
}