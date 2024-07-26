import { PartialType } from '@nestjs/swagger';
import { CreateJobApplicationDto } from './create-job-application.dto';

export class UpdateJobApplicationDto extends PartialType(CreateJobApplicationDto) {}
