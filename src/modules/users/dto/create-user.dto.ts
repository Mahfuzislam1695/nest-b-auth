import { ApiProperty } from "@nestjs/swagger";
import { Role, Status } from "@prisma/client";
import { IsNotEmpty, IsString, IsEmail, MinLength, Matches, IsOptional } from "class-validator";
import { IsValidName } from "src/common/decorators/user/is-valid-name.decorator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Name of the user',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    @IsValidName()
    name: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'test@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'password123',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    role?: Role;

    @IsString()
    @IsOptional()
    status?: Status;
}