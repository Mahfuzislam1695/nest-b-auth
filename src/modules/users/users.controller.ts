import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { sendResponse } from 'src/common/responses/send-response';
import { Role, Status } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('Authorization')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto, description: 'User data for creation' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists.' })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    console.log("createUserDto", createUserDto);

    const result = await this.usersService.create(createUserDto);

    console.log("result", result);


    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  }


  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of users.' })
  @ApiQuery({ name: 'role', required: false, enum: Role, description: 'Filter users by role' })
  @ApiQuery({ name: 'status', required: false, enum: Status, description: 'Filter users by status' })
  async findAll(
    @Res() res: Response,
    @Query('role') role?: Role,
    @Query('status') status?: Status,
  ) {
    const users = await this.usersService.findAll({ role, status });

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Users retrieved successfully!',
      data: users,
    });
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(+id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User retrieved successfully!',
      data: user,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiBody({ type: UpdateUserDto, description: 'User data for update' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const user = await this.usersService.update(+id, updateUserDto);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User updated successfully!',
      data: user,
    });
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.remove(+id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User deleted successfully!',
      data: user,
    });
  }
}