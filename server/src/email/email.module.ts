import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UsersService } from 'src/users/users.service';
import { MailModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MailModule, ConfigModule.forRoot()],
  controllers: [EmailController],
  providers: [EmailService, UsersService],
})
export class EmailModule {}
