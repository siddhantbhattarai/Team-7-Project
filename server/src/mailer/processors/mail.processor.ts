import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import {
  SENT_OTP,
  MAIL_QUEUE,
  WELCOME_MSG,
  SEND_MAIL_NOW,
  SEND_QUEUE_MAIL,
  EXTRACT_INFO,
} from '../constants';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from 'src/prisma/prisma.service';
import { evaluateCandidateProfile, infoExtractor } from 'src/utils/string-format';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly _logger = new Logger(MailProcessor.name);
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job) {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this._logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this._logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
    try {
      return this._mailerService.sendMail({
        to: this._configService.get('EMAIL_ADDRESS'),
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: 'Something went wrong with server!!',
        template: './error',
        context: {},
      });
    } catch {
      this._logger.error('Failed to send confirmation email to admin');
    }
  }

  @Process(SENT_OTP)
  public async sendOTP(job: Job<{ email: string; otp: string }>) {
    this._logger.log(`Sending otp email to '${job.data.email}'`);

    try {
      return this._mailerService.sendMail({
        to: job.data.email,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: 'Sign In OTP ISMT Hub',
        template: './otp',
        context: { name: job.data.email, otp: job.data.otp },
      });
    } catch {
      this._logger.error(`Failed to send confirmation email to '${job.data.email}'`);
    }
  }

  @Process(EXTRACT_INFO)
  public async extractInfo(
    job: Job<{
      text: string;
      vacancy: string;
    }>,
  ) {
    this._logger.log(`Processing Candidate Info for job vacancy ${job.data.vacancy}`);

    try {
      const info = await infoExtractor(job.data.text);

      console.log(`Extracted info`, info);

      // check for same email with same job vacancy and if exist the update it
      const existing = await this.prismaService.jobApplication.findFirst({
        where: {
          email: info.email,
          jobVacancyId: job.data.vacancy,
        },
      });
      let user: any;

      if (existing) {
        user = await this.prismaService.jobApplication.update({
          where: { id: existing.id },
          data: {
            name: info.name,
            phone: info.phoneNo,
            yearsOfExperience: info.yearsOfExperience,
            skills: info.skills,
            profile: info.profile,
            summary: info.summary,
          },
          include: {
            jobVacancy: true,
          },
        });
      } else {
        user = await this.prismaService.jobApplication.create({
          data: {
            name: info.name,
            email: info.email,
            phone: info.phoneNo,
            yearsOfExperience: info.yearsOfExperience,
            skills: info.skills,
            profile: info.profile,
            summary: info.summary,
            jobVacancyId: job.data.vacancy,
          },
          include: {
            jobVacancy: true,
          },
        });
      }

      const result = await evaluateCandidateProfile(info, user.jobVacancy.body);
      this._logger.log(`Match percentage: ${result.matchPercentage}`);
      await this.prismaService.jobApplication.update({
        where: { id: user.id },
        data: {
          matchPercentage: +result.matchPercentage,
          shortInfo: result.candidateInfo,
        },
      });

      return;
    } catch (error: any) {
      this._logger.error(`Failed to extract info for job vacancy ${job.data.vacancy}`);
    }
  }

  @Process(SEND_MAIL_NOW)
  public async sendMailNow(
    job: Job<{
      email: string;
      author: string;
      subject: string;
      body: string;
    }>,
  ) {
    this._logger.log(`Sending instant email to '${job.data.email}' by '${job.data.author}'`);

    try {
      return this._mailerService.sendMail({
        to: job.data.email,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: job.data.subject,
        template: './instantEmail',
        context: {
          author: job.data.author,
          email: job.data.email,
          subject: job.data.subject,
          body: job.data.body,
        },
      });
    } catch {
      this._logger.error(
        `Failed to send confirmation email to '${job.data.email}' by '${job.data.author}'`,
      );
    }
  }

  @Process(SEND_QUEUE_MAIL)
  public async sendQueueMail(
    job: Job<{
      email: string;
      author: string;
      subject: string;
      body: string;
    }>,
  ) {
    this._logger.log(`Sending queue email to '${job.data.email}' by '${job.data.author}'`);

    try {
      return this._mailerService.sendMail({
        to: job.data.email,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: job.data.subject,
        template: './instantEmail',
        context: {
          author: job.data.author,
          email: job.data.email,
          subject: job.data.subject,
          body: job.data.body,
        },
      });
    } catch {
      this._logger.error(
        `Failed to send confirmation email to '${job.data.email}' by '${job.data.author}'`,
      );
    }
  }
  @Process(WELCOME_MSG)
  public async welcome(
    job: Job<{ email: string; name: string; password: string; appUrl: string }>,
  ) {
    this._logger.log(`Sending welcome email to '${job.data.email}'`);

    try {
      return this._mailerService.sendMail({
        to: job.data.email,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: 'Welcome to ISMT Hub',
        template: './welcome',
        context: {
          name: job.data.name,
          email: job.data.email,
          password: job.data.password,
          appUrl: job.data.appUrl,
        },
      });
    } catch {
      this._logger.error(`Failed to send confirmation email to '${job.data.email}'`);
    }
  }
}
