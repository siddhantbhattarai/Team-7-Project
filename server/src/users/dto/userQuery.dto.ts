import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class PaginateQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The page number',
    required: false,
    default: '1',
    example: 1,
  })
  page: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The number of items per page',
    required: false,
    default: '10',
    example: 10,
  })
  perPage: string;

  @Transform(({ value }) => value.toUpperCase(), { toClassOnly: true })
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The role of the user',
    required: false,
    type: Role,
    example: 'ADMIN',
  })
  role: Role;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The search paramenter (name) of the user',
    required: false,
    example: 'John Doe',
  })
  search: string;
}
