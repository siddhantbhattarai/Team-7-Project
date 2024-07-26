import { Injectable, Logger } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobApplicationService {
  private _logger = new Logger(JobApplicationService.name);

  constructor(private readonly prisma: PrismaService) {}

  create(createJobApplicationDto: CreateJobApplicationDto) {
    return this.prisma.jobApplication.create({
      data: createJobApplicationDto,
    });
  }
  async findAll() {
    return this.prisma.jobApplication.findMany();
  }

  async findOne(id: string) {
    return this.prisma.jobApplication.findUnique({ where: { id } });
  }

  async remove(id: string) {
    return this.prisma.jobApplication.delete({ where: { id } });
  }
  update(id: string, updateJobApplicationDto: UpdateJobApplicationDto) {
    return this.prisma.jobApplication.update({
      where: { id },
      data: updateJobApplicationDto,
    });
  }
}
