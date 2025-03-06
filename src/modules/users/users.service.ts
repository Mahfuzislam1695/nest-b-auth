import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { ApiError } from 'src/common/errors/api-error';
import { Role, Status } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }


  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    console.log("existingUser", existingUser);


    if (existingUser) {
      throw new ApiError(HttpStatus.CONFLICT, 'Email already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create the user in the database
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }



  async findAll(filters?: { role?: Role; status?: Status }) {
    return this.prisma.user.findMany({
      where: {
        role: filters?.role ? { equals: filters.role } : undefined,
        status: filters?.status ? { equals: filters.status } : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(HttpStatus.CONFLICT, `User with ID ${id} not found.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError(HttpStatus.CONFLICT, `User with ID ${id} not found.`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError(HttpStatus.CONFLICT, `User with ID ${id} not found.`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
