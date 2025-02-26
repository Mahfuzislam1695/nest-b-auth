import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { createStudentDto } from './dto/create-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { editStudentDto } from './dto/edit-student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  // ? Create new student

  async createStudent(dto: createStudentDto) {
    try {
      return await this.prisma.student.create({
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // * P2002 is the unique constraint violation error code
          throw new ConflictException(
            `A student with this ${error.meta.target} already exists.`,
          );
        }
      }

      // * Handle other potential errors
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  // ? Get all students

  getAllStudents() {
    return this.prisma.student.findMany();
  }

  // ? Get a student

  getStudent(studentId: number) {
    const student = this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return student;
  }

  // ? Update student by id

  async updateStudent(studentId: number, dto: editStudentDto) {
    // * Check if the student exists
    const existingStudent = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // * Validate unique email
    if (dto.email) {
      const emailExists = await this.prisma.student.findFirst({
        where: {
          email: dto.email,
          NOT: { id: studentId }, // Exclude the current student's ID
        },
      });

      if (emailExists) {
        throw new BadRequestException(`Email ${dto.email} is already in use`);
      }
    }

    // * Validate unique phoneNo
    if (dto.phoneNo) {
      const phoneNoExists = await this.prisma.student.findFirst({
        where: {
          phoneNo: dto.phoneNo,
          NOT: { id: studentId }, // Exclude the current student's ID
        },
      });

      if (phoneNoExists) {
        throw new BadRequestException(
          `Phone number ${dto.phoneNo} is already in use`,
        );
      }
    }

    // * Perform the update
    return this.prisma.student.update({
      where: { id: studentId },
      data: {
        ...dto,
      },
    });
  }

  // ? Delete a student by id

  deleteStudent(studentId: number) {
    // * Check if the student exists
    const student = this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return this.prisma.student.delete({
      where: { id: studentId },
    });
  }
}
