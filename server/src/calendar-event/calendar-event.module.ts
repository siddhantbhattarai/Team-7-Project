import { Module } from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEventController } from './calendar-event.controller';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [CalendarEventController],
  providers: [CalendarEventService, EmailService, UsersService],
})
export class CalendarEventModule {}
