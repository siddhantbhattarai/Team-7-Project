import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/create-email.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mailer/mailer.service';

@Injectable()
export class EmailService {
  private readonly _logger = new Logger(EmailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private mailService: MailService,
  ) {}

  async createTemplate(data: CreateEmailTemplateDto) {
    const { createdBy, ...rest } = data;

    try {
      this._logger.log(`Creating email template by user: ${createdBy}`);
      const doesExist = await this.userService.findOne(createdBy);

      if (!doesExist) {
        throw new BadRequestException(`User with id: ${createdBy} does not exist`);
      }

      const template = await this.prisma.emailTemplates.create({
        data: {
          ...rest,
          createdBy: {
            connect: {
              id: createdBy,
            },
          },
        },
        include: {
          createdBy: true,
        },
      });
      return template;
    } catch (error) {
      this._logger.error(`Error in creating email template: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async sendAndCreateTemplate(
    data: CreateEmailTemplateDto & {
      to: string;
    },
  ) {
    const { to, ...rest } = data;
    try {
      this._logger.log(`Sending email to: ${to}`);
      const result = await this.createTemplate(rest);

      // Add email in queue to send email
      this.mailService.sendEmailNow({
        email: to,
        subject: rest.subject,
        body: rest.body,
        author: result.createdBy.name,
      });

      return {
        message: 'Email sent successfully',
        result,
      };
    } catch (error) {
      this._logger.error(`Error in sending email: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllTemplate() {
    try {
      this._logger.log(`Getting all email templates`);
      const template = await this.prisma.emailTemplates.findMany({
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
              id: true,
              profileImage: true,
            },
          },
        },
      });
      return template;
    } catch (error) {
      this._logger.error(`Error in getting email template: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneTemplate(id: string) {
    try {
      this._logger.log(`Getting email template by id: ${id}`);
      const template = await this.prisma.emailTemplates.findUnique({
        where: {
          id,
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
              id: true,
              profileImage: true,
            },
          },
        },
      });
      return template;
    } catch (error) {
      this._logger.error(`Error in getting a email template: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateTemplate(id: string, updateEmailDto: UpdateEmailTemplateDto) {
    try {
      this._logger.log(`Updating email template by id: ${id}`);
      const doesExist = await this.findOneTemplate(id);
      if (!doesExist) {
        throw new BadRequestException(`Email template with id: ${id} does not exist`);
      }

      const { createdBy, ...rest } = updateEmailDto;

      const template = await this.prisma.emailTemplates.update({
        where: {
          id,
        },
        data: {
          ...rest,
          createdBy: {
            connect: {
              id: createdBy,
            },
          },
          updatedAt: new Date(),
        },
      });
      return template;
    } catch (error) {
      this._logger.error(`Error in updateing a email template: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeTemplate(id: string) {
    try {
      this._logger.log(`Deleting email template by id: ${id}`);
      const doesExist = await this.findOneTemplate(id);
      if (!doesExist) {
        throw new BadRequestException(`Email template with id: ${id} does not exist`);
      }
      await this.prisma.emailTemplates.delete({
        where: {
          id,
        },
      });

      return { message: 'Email template deleted successfully' };
    } catch (error) {
      this._logger.error(`Error in deleting a email template: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }
}
