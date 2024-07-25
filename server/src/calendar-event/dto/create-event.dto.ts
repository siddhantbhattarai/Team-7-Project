import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCalendarEventDto {
  @IsString()
  @ApiProperty({
    description: 'Title of the event',
    example: 'Title of the event',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'Description of event',
    example: 'Description of event',
  })
  description: string;

  @IsString()
  @ApiProperty({
    description: 'User who created this email',
    example: '2342-23424',
  })
  time: string;

  @IsString()
  @ApiProperty({
    description: 'Templated id',
    example: '2342-23424',
  })
  templateId: string;

  @IsString()
  @ApiProperty({
    description: 'User who created created this event',
    example: '2342-23424',
  })
  createdBy: string;

  @IsString()
  @ApiProperty({
    description: 'Color of event',
    example: '#242kjj',
  })
  color: string;

  @IsString()
  @ApiProperty({
    description: 'Templated id',
    example: '2342-23424',
  })
  @IsOptional()
  to: string;

  @ApiProperty({
    description: 'Metadata of event ',
    example: { key: 'value' },
  })
  @IsOptional()
  condition: Record<string, any>;
}

export class UpdateCalendarEvent extends PartialType(CreateCalendarEventDto) {}
