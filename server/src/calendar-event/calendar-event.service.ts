import * as schedule from 'node-schedule';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCalendarEventDto, UpdateCalendarEvent } from './dto/create-event.dto';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mailer/mailer.service';

@Injectable()
export class CalendarEventService {
  private _logger = new Logger(CalendarEventService.name);
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  async markEventAsCompleted(id: string) {
    try {
      this._logger.log(`Marking event as completed for event id ${id}`);
      const event = await this.prismaService.calendarEvents.findUnique({
        where: { id },
      });
      if (!event) {
        throw new BadRequestException(`Event with id ${id} does not exist`);
      }
      await this.prismaService.calendarEvents.update({
        where: { id },
        data: { status: 'COMPLETED' },
      });
      return event;
    } catch (error) {
      this._logger.error(
        `Error marking event as completed because '${error.message}' for event id ${id}`,
      );
    }
  }

  async createEvent(createCalendarEventDto: CreateCalendarEventDto) {
    const { templateId, createdBy, time, ...data } = createCalendarEventDto;
    try {
      const email = await this.emailService.findOneTemplate(templateId);
      if (!email) {
        throw new BadRequestException(`Invalid templated id provided ${templateId}`);
      }

      const user = await this.userService.findOne(createdBy);
      if (!user) {
        throw new BadRequestException(`Invalid user id provided ${createdBy}`);
      }
      const event = await this.prismaService.calendarEvents.create({
        data: {
          ...data,
          eventDateTime: time,
          createdBy: {
            connect: {
              id: createdBy,
            },
          },
          emailTemplate: {
            connect: {
              id: templateId,
            },
          },
        },
        include: {
          createdBy: true,
          emailTemplate: true,
        },
      });

      this.scheduleEmailJob(event);
      return event;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateEvent(id: string, data: UpdateCalendarEvent) {
    try {
      const event = await this.prismaService.calendarEvents.findUnique({
        where: { id },
      });
      if (!event) {
        throw new BadRequestException(`Event with id ${id} does not exist`);
      }
      const { templateId, createdBy, ...rest } = data;
      const updatedEvent = await this.prismaService.calendarEvents.update({
        where: { id },
        data: {
          ...rest,
          eventDateTime: data.time || event.eventDateTime,
          color: data.color || event.color,
          condition: data.condition || event.condition,
          ...(templateId && {
            emailTemplate: {
              connect: {
                id: templateId,
              },
            },
          }),
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
          emailTemplate: true,
        },
      });
      return updatedEvent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getEvents() {
    this._logger.log('Fetching all events');
    try {
      const events = await this.prismaService.calendarEvents.findMany({
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
          emailTemplate: true,
        },
      });
      return events;
    } catch (error) {
      this._logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async scheduleEmailJob(event: any) {
    const { condition, to, eventDateTime } = event;

    // if to then msg should be send to one email with particular details
    if (to) {
      this._logger.log(
        `Email will be sent to ${to} at ${new Date(eventDateTime).toLocaleDateString()} ${new Date(
          eventDateTime,
        ).toLocaleTimeString()}`,
      );

      await this.scheduleEmailJobWithEmail(to, event);

      return;
    }

    // if not conditions then msg should be send to multiple emails with particular details
    const users = await this.userService.getUsersByFilters({
      batch: condition.batches.length ? condition.batches : null,
      course: condition.course,
      section: condition.sections.length ? condition.sections : null,
      tags: condition.tags.length ? condition.tags : null,
    });

    this._logger.log(
      `Email will be sent to ${users.length} users at ${new Date(
        eventDateTime,
      ).toLocaleDateString()}`,
    );

    if (users.length === 0) {
      return;
    }

    await this.scheduleEmailJobWithUsers(event);

    return;
  }

  /**
   * @param users
   * @param event
   * @returns void
   * @private
   * @memberof CalendarEventService
   * @description Schedule email job to send email to multiple users
   * */
  private async scheduleEmailJobWithUsers(event: any) {
    try {
      const { eventDateTime } = event;
      this.mailService.sendQueueEmail;

      schedule.scheduleJob(
        new Date(eventDateTime),
        async function (y: any) {
          const { id, createdBy, emailTemplate, condition } = y;

          const users = await this.userService.getUsersByFilters({
            batch: condition.batches.length ? condition.batches : null,
            course: condition.course,
            section: condition.sections.length ? condition.sections : null,
            tags: condition.tags.length ? condition.tags : null,
          });

          this._logger.log(
            `Running event ${event.title} to send email to ${users.length} users at ${new Date(
              eventDateTime,
            ).toLocaleDateString()} ${new Date(eventDateTime).toLocaleTimeString()}`,
          );

          for (const user of users) {
            this.mailService.sendQueueEmail({
              email: user.email,
              subject: emailTemplate.subject,
              body: emailTemplate.body,
              author: createdBy.name,
            });
          }
          await this.markEventAsCompleted(id);
        }.bind(this, event),
      );
    } catch (error) {
      this._logger.error(`Error scheduling email job with users because '${error.message}'`);
    }
  }

  /**
   * Schedule email job to send email to one user
   * @param to string
   * @param event Event
   * @returns void
   */
  private async scheduleEmailJobWithEmail(to: string, event: any) {
    try {
      const { eventDateTime } = event;

      const job = schedule.scheduleJob(
        new Date(eventDateTime),
        async function (y: any, receiver: string) {
          this._logger.log(
            `Running event ${event.title} to send email to ${receiver} at ${new Date(
              eventDateTime,
            ).toLocaleDateString()} ${new Date(eventDateTime).toLocaleTimeString()}`,
          );

          const { id, createdBy, emailTemplate: template } = y;

          this.mailService.sendEmailNow({
            email: receiver,
            subject: template.subject,
            body: template.body,
            author: createdBy.name,
          });

          await this.markEventAsCompleted(id);
        }.bind(this, event, to),
      );
      return job;
    } catch (error) {
      this._logger.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteEvent(id: string) {
    try {
      const event = await this.prismaService.calendarEvents.findUnique({
        where: { id },
      });
      if (!event) {
        throw new BadRequestException(`Event with id ${id} does not exist`);
      }
      await this.prismaService.calendarEvents.delete({
        where: { id },
      });
      return event;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
