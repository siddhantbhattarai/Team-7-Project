import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/create-email.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('email')
@ApiTags('Users')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new email template' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateEmailTemplateDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createAndSend(
    @Body()
    createEmailDto: CreateEmailTemplateDto & {
      to: string;
    },
  ) {
    return this.emailService.sendAndCreateTemplate(createEmailDto);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new email template' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateEmailTemplateDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createEmailDto: CreateEmailTemplateDto) {
    return this.emailService.createTemplate(createEmailDto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all emails' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateEmailTemplateDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.emailService.findAllTemplate();
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get one email' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateEmailTemplateDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.emailService.findOneTemplate(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update an email template' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateEmailTemplateDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailTemplateDto) {
    return this.emailService.updateTemplate(id, updateEmailDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a email template' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreateEmailTemplateDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.emailService.removeTemplate(id);
  }
}
