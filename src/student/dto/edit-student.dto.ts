import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class editStudentDto {
  @ApiPropertyOptional({
    description: 'First name of the student',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName: string;

  @ApiPropertyOptional({
    description: 'Last name of the student',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Email of the student',
    example: 'test@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone no of the student',
    example: '01717123456',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phoneNo: string;

  @ApiPropertyOptional({
    description: 'City name of the student',
    example: 'Dhaka',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city: string;

  @ApiPropertyOptional({
    description: 'Preferred destination of the student',
    example: 'USA',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  destination: string;

  @ApiPropertyOptional({
    description: 'Message of the student',
    example: 'I want to learn about foreign studies',
  })
  @IsString()
  @IsOptional()
  message: string;
}
