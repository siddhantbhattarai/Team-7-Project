import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JWTStrategy, RefreshJWTStrategy, LocalStrategy } from './strategies';
import { MailModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: +process.env.JWT_EXPIRATION_TIME },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, LocalStrategy, JWTStrategy, RefreshJWTStrategy],
  exports: [AuthService],
})
export class AuthModule {}
