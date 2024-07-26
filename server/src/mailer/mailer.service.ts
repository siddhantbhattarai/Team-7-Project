import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import {
  SENT_OTP,
  MAIL_QUEUE,
  WELCOME_MSG,
  SEND_MAIL_NOW,
  SEND_QUEUE_MAIL,
  EXTRACT_INFO,
} from './constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { jobOptions } from './config/bullOptions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  constructor(
    @InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue,
    private readonly prismaService: PrismaService,
  ) {}

  public async extractInfo({ text, jobId }: { text: string; jobId: string }) {
    try {
      this._logger.log(`Queueing info extraction for job vacancy ${jobId}`);
      await this._mailQueue.add(
        EXTRACT_INFO,
        {
          text,
          vacancy: jobId,
        },
        jobOptions,
      );
    } catch (error) {
      this._logger.error(`Error queueing info extraction for job vacancy ${jobId}`);
      throw error;
    }
  }

  public async sendEmailNow({
    email,
    subject,
    body,
    author,
  }: {
    email: string;
    subject: string;
    body: string;
    author: string;
  }): Promise<void> {
    try {
      await this._mailQueue.add(
        SEND_MAIL_NOW,
        {
          email,
          subject,
          body,
          author,
        },
        jobOptions,
      );
    } catch (error) {
      this._logger.error(`Error queueing instant email to user ${email}`);
      throw error;
    }
  }

  public async sendQueueEmail({
    email,
    subject,
    body,
    author,
  }: {
    email: string;
    subject: string;
    body: string;
    author: string;
  }): Promise<void> {
    this._logger.log(`Queueing email to user ${email} by ${author}`);
    try {
      await this._mailQueue.add(
        SEND_QUEUE_MAIL,
        {
          email,
          subject,
          body,
          author,
        },
        jobOptions,
      );
    } catch (error) {
      this._logger.error(`Error queueing instant email to user ${email}`);
      throw error;
    }
  }

  public async sendOTP({ email, otp }: { email: string; otp: string }): Promise<void> {
    try {
      await this._mailQueue.add(
        SENT_OTP,
        {
          email,
          otp,
        },
        jobOptions,
      );
    } catch (error) {
      this._logger.error(`Error queueing registration email to user ${email}`);
      throw error;
    }
  }

  public async welcome({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    try {
      const appUrl = process.env.CLIENT_URL;
      await this._mailQueue.add(
        WELCOME_MSG,
        {
          name,
          email,
          password,
          appUrl,
        },
        jobOptions,
      );
    } catch (error) {
      this._logger.error(`Error queueing registration email to user ${email}`);
      throw error;
    }
  }
}
