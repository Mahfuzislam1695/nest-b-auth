import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createStudentDto {
  @ApiProperty({
    description: 'First name of the student',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the student',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email of the student',
    example: 'test@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone no of the student',
    example: '01717123456',
  })
  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty({
    description: 'City name of the student',
    example: 'Dhaka',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Preferred destination of the student',
    example: 'USA',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiPropertyOptional({
    description: 'Message of the student',
    example: 'I want to learn about foreign studies',
  })
  @IsString()
  @IsOptional()
  message: string;
}
