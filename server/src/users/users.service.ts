import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginateQueryDto, StudentQueryDto } from './dto/userQuery.dto';
import { paginate } from 'src/utils/paginate';

@Injectable()
export class UsersService {
  private readonly _logger = new Logger(UsersService.name);
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    this._logger.log(`Registering new user: ${createUserDto?.email}`);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    this._logger.log(`Creating new user: ${createUserDto?.email}`);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async getUsersByFilters(query: StudentQueryDto) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          AND: [this.queryBuilder(query)],
        },
      });

      return users;
    } catch (error) {
      this._logger.error(error.message);
      throw new InternalServerErrorException(error?.message || 'Internal Server Error');
    }
  }

  private queryBuilder(query: StudentQueryDto) {
    const filter: any = {};
    const { batch, section, course, tags } = query;
    if (batch) {
      filter.batch = { in: batch.filter(item => item !== '') };
    }
    if (section) {
      filter.section = { in: section.filter(item => item !== '') };
    }
    if (course) {
      filter.course = course;
    }
    if (tags) {
      filter.tags = { hasSome: tags.filter(item => item !== '') };
    }

    return filter;
  }

  async getUserCountByFilters(query: StudentQueryDto) {
    try {
      this._logger.log(`Fetching user count by filters`);

      const count = await this.prisma.user.count({
        where: {
          AND: [this.queryBuilder(query)],
        },
      });

      return { count };
    } catch (error) {
      this._logger.error(error.message);
      throw new InternalServerErrorException(error?.message || 'Internal Server Error');
    }
  }

  async getUniqueFields() {
    this._logger.log('Fetching all students');
    try {
      const uniqueBatches = await this.prisma.user.findMany({
        select: {
          batch: true,
        },
        distinct: ['batch'],
      });

      const uniqueSections = await this.prisma.user.findMany({
        select: {
          section: true,
        },
        distinct: ['section'],
      });

      const uniqueCourses = await this.prisma.user.findMany({
        select: {
          course: true,
        },
        distinct: ['course'],
      });

      const uniqueTagsResult = await this.prisma.user.findMany({
        select: {
          tags: true,
        },
      });

      const uniqueTags = Array.from(new Set(uniqueTagsResult.flatMap(user => user.tags)));

      return {
        batch: uniqueBatches.map(user => user.batch).filter(batch => batch !== null),
        section: uniqueSections.map(user => user.section).filter(section => section !== null),
        course: uniqueCourses.map(user => user.course).filter(course => course !== null),
        tags: uniqueTags,
      };

      // return students;
    } catch (error) {
      this._logger.error(error.message);
      throw new InternalServerErrorException(error?.message || 'Internal Server Error');
    }
  }

  async findAll(query: PaginateQueryDto) {
    this._logger.log('Fetching all users');
    if (!query.role) {
      throw new BadRequestException('Role is required');
    }
    try {
      this.prisma.user.findMany({
        where: {
          roles: {
            // has: query.role,
            hasSome: [query.role],
          },
        },
      });
      const users = await paginate(
        this.prisma.user,
        {
          where: {
            roles: {
              hasSome: [query.role],
            },

            OR: [
              {
                name: {
                  contains: query.search || '',
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: query.search || '',
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
        { perPage: +query.perPage || 10, page: +query.page || 1 },
      );

      return users;
    } catch (error) {
      this._logger.error(error);
      throw new InternalServerErrorException(error?.message || 'Internal Server Error');
    }
  }

  async findOne(id: string) {
    try {
      const users = await this.prisma.user.findUnique({ where: { id } });
      return users;
    } catch (error) {
      this._logger.error(error);
      throw new InternalServerErrorException(error?.message || 'Internal Server Error');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this._logger.log(`Updating user: ${id}`);
    return `This action updates a #${id} user with payload ${updateUserDto}`;
  }

  async remove(id: string) {
    try {
      const isUser = await this.findOne(id);
      if (!isUser) {
        throw new BadRequestException('User not found');
      }
      await this.prisma.user.delete({ where: { id } });
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      this._logger.error(error);
      throw new InternalServerErrorException(error?.message || 'Internal Server Error');
    }
  }

  async findOneByEmail(email: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
