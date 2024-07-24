import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService, UsersService],
})
export class EmailModule {}
