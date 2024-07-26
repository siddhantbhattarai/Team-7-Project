import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsUUID,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ACTIVE;

  @IsArray()
  @IsString({ each: true })
  employmentTypes: string[];

  @IsString()
  experience: string;

  @IsString()
  role: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @IsString({ each: true })
  workSchedule: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  location: string[];

  @IsDate()
  @Type(() => Date)
  expiryDate: Date;

  @IsObject()
  salary: Record<string, any>;

  @IsBoolean()
  salaryNegotiable: boolean;

  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;

  @IsUUID()
  userId: string;
}

export class UpdateJobDto extends PartialType(CreateJobDto) {}
