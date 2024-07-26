import { Module } from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEventController } from './calendar-event.controller';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [MailModule, ConfigModule.forRoot()],
  controllers: [CalendarEventController],
  providers: [CalendarEventService, UsersService, EmailService],
})
export class CalendarEventModule {}
