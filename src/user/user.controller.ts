import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';

// ? Guarding protected routes

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  //? @desc    login
  //? @route   GET /api/users/me
  //? @access  private
  @Get('me')
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    console.log({
      email,
    });
    return user;
  }
}
