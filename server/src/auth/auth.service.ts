import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { totp } from 'otplib';
import { hashPassword, comparePassword } from 'src/utils/hash';
import { MailService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly _logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private mailService: MailService,
    private readonly _configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<CreateUserDto, 'password'>> {
    const res = await this.userService.findOneByEmail(email);

    if (res) {
      const { password, ...user } = res;
      const isValid = await comparePassword(pass, password);
      if (isValid) return user;

      return null;
    }

    throw new BadRequestException('Invalid email or password');
  }

  async validateRegistration(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user && !user.isActive) {
      this._logger.log('Send opt to existing user..');
      return await this.sendOtp({ email });
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email should be unique');
    }

    const password = createUserDto.password;
    const hashedPassword = await hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;

    const createdUser = await this.userService.register(createUserDto);
    if (createdUser) {
      this.mailService.welcome({
        email: createdUser?.email,
        name: createdUser?.name,
        password,
      });

      return {
        success: true,
        message: 'User created successfully!',
      };
    }
    throw new BadRequestException('Bad Request');
  }

  async sendOtp(AuthDto: Omit<AuthDto, 'otp'>) {
    this._logger.log(`Sending Login OTP to ${AuthDto?.email}`);
    const { email } = AuthDto;
    const user = await this.userService.findOneByEmail(email);
    if (user && user?.isActive) {
      this._logger.log(`Generating Login OTP to ${AuthDto?.email}`);
      const token = totp.generate(process.env.OTP_SECRET);
      if (token) {
        this.mailService.sendOTP({ email: user?.email, otp: token });
        return { success: true, msg: 'OTP sent successfully' };
      }
    }
    throw new NotFoundException('User not found');
  }

  async login(user: any) {
    this._logger.log(`Sending jwt tokens to ${user?.email}`);
    let userWithoutPassword;

    if (user.password) {
      const { password, ...rest } = user;
      userWithoutPassword = rest;
    } else {
      userWithoutPassword = user;
    }
    const validUser = await this.userService.findOneByEmail(user.email);

    if (!validUser.isActive) {
      throw new ForbiddenException('Your account is blocked. Please contact support team.');
    }

    const payload = {
      id: user.id,
      sub: {
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
    return {
      ...userWithoutPassword,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: +this._configService.get('JWT_EXPIRATION_LONG_TIME'),
      }),
    };
  }

  async refreshToken(user: any) {
    this._logger.log(`Generating access token to ${user?.email}`);
    const payload = {
      id: user.id,
      sub: {
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateJwt() {
    return { success: true, msg: 'Valid JWT' };
  }
}
