import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  @IsOptional()
  profile?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  yearsOfExperience?: string;

  @IsUUID()
  jobVacancyId: string;
}
