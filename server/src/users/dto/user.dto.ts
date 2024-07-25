import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString, IsArray, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@doe.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Address of the user',
    example: 'Kathmandu, Nepal',
  })
  address: string;

  @IsString()
  @ApiProperty({
    description: 'Full Name of the user',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Course of user',
    example: 'Bsc.CSIT',
  })
  batch: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Course of user',
    example: 'Bsc.CSIT',
  })
  section: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Course of user',
    example: 'Bsc.CSIT',
  })
  course: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Gender of user',
    example: 'Male',
  })
  gender: string;

  @IsString()
  @ApiProperty({
    description: 'password',
    example: 'hero@123',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Date of birth',
    example: '2001/01/02',
  })
  dob: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Phone of user',
    example: '9811111111',
  })
  phoneNumber: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Array of tags associated with the user',
    example: '["BATCH-2020"]',
  })
  tags: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Array of roles associated with the user',
    example: '["USER"]',
  })
  roles: Role[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Active state of user',
    example: 'true',
  })
  isActive: boolean;
}
