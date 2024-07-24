import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginateQueryDto } from './dto/userQuery.dto';
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
