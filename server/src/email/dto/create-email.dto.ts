import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsJSON } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsString()
  @ApiProperty({
    description: 'Subject of email template',
    example: 'Regarding your account',
  })
  subject: string;

  @IsString()
  @ApiProperty({
    description: 'Body of email template',
    example:
      '<p>Dear User, <br> Your account is created successfully. <br> Regards, <br> Admin</p>',
  })
  body: string;

  @IsString()
  @ApiProperty({
    description: 'User whio created this email',
    example: '2342-23424',
  })
  createdBy: string;

  // TODO: Add to (email) condition
  @ApiProperty({
    description: 'Metadata of email template',
    example: { key: 'value' },
  })
  @IsOptional()
  condition: Record<string, any>;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Status of email template',
    example: 'ACTIVE',
  })
  status: string;
}

export class UpdateEmailTemplateDto extends PartialType(CreateEmailTemplateDto) {}
