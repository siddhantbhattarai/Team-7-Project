/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { convertPdfFileToText } from 'src/utils/fileHandle';
import { PrismaService } from 'src/prisma/prisma.service';
import OpenAI from 'openai';
import { MailService } from 'src/mailer/mailer.service';
import { extractData } from 'src/utils/string-format';
import { CreateJobDto, UpdateJobDto } from './dto/create-job.dto';

const dummyResponse = `
Name: Dipesh Kumar Sah
Email: dipeshsah98@gmail.com
Phone Number: +9779808982517
Years of Experience: Approximately 2 years
Skills Set: [Javascript, Typescript, Python, Solidity, SQL, No SQL, Redis, ReactJs, NextJs, NestJs, ExpressJs, Django, Git]
Profile: Full Stack Developer
Summary: Dipesh Kumar Sah is a Full Stack Developer with around 2 years of experience, skilled in Javascript, Typescript, Python, Solidity, and various other technologies. He has worked on projects involving frontend and backend development, API design, and optimization strategies.
`;

@Injectable()
export class JobsService {
  private readonly _logger = new Logger(JobsService.name);
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  constructor(private readonly prismaService: PrismaService, private mailModule: MailService) {}

  async create(req: any, res: any, vacancyId: string) {
    try {
      const file = await req['incomingFile'];
      const pdfText = await convertPdfFileToText(file);
      // Remove special characters except "@", "+", ".", and "/"
      let cleanedText = pdfText.replace(/[^a-zA-Z0-9@+./]/g, ' ');
      // Format the text for better readability \n\n with " " and \n with ""
      cleanedText = cleanedText.replace(/\n\n/g, ' ').replace(/\n/g, '');

      // this.infoExtractor(vacancyId, cleanedText);
      this.mailModule.extractInfo({ text: cleanedText, jobId: vacancyId });

      res.send({
        data: cleanedText,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async createJob(createJobVacancyDto: CreateJobDto) {
    try {
      this._logger.log(`Creating job with title: ${createJobVacancyDto.title}`);

      const job = await this.prismaService.jobVacancy.create({
        data: createJobVacancyDto,
      });
      return job;
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async updateJob(id: string, updateJobVacancyDto: UpdateJobDto) {
    try {
      this._logger.log(`Updating job with id: ${id}`);

      const job = this.prismaService.jobVacancy.findUnique({
        where: { id },
      });

      if (!job) {
        throw new BadRequestException(`Job with id: ${id} not found`);
      }

      await this.prismaService.jobVacancy.update({
        where: { id },
        data: updateJobVacancyDto,
      });
      return {
        message: 'Job vacancy updated successfully',
      };
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async deleteJob(id: string) {
    try {
      this._logger.log(`Deleting job with id: ${id}`);

      const job = this.prismaService.jobVacancy.findUnique({
        where: { id },
      });

      if (!job) {
        throw new BadRequestException(`Job with id: ${id} not found`);
      }

      await this.prismaService.jobVacancy.delete({
        where: { id },
      });
      return {
        message: 'Job vacancy deleted successfully',
      };
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    try {
      this._logger.log('Finding all jobs');
      const jobs = this.prismaService.jobVacancy.findMany({
        include: {
          JobApplication: {
            where: {
              NOT: {
                matchPercentage: null,
              },
            },
            orderBy: {
              matchPercentage: 'desc',
            },
          },
        },
      });
      return jobs;
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: string) {
    try {
      this._logger.log(`Finding job with id: ${id}`);

      const job = this.prismaService.jobVacancy.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              JobApplication: true,
            },
          },
        },
      });
      return job;
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    try {
      this._logger.log(`Updating job with id: ${id}`);

      const job = await this.findOne(id);
      if (!job) {
        throw new BadRequestException(`Job with id: ${id} not found`);
      }

      const updatedJOb = await this.prismaService.jobVacancy.update({
        where: { id },
        data: updateJobDto,
      });
      return {
        message: 'Job vacancy updated successfully',
      };
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      this._logger.log(`Deleting job with id: ${id}`);

      const job = await this.findOne(id);
      if (!job) {
        throw new BadRequestException(`Job with id: ${id} not found`);
      }

      await this.prismaService.jobVacancy.delete({
        where: { id },
      });
      return {
        message: 'Job vacancy deleted successfully',
      };
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
