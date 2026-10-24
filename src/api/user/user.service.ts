import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../../config/prisma/prisma.service.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { JwtAuthService } from '../../config/jwt/jwt.service.js';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtAuthSeervice: JwtAuthService,
  ) {}

  create(createUserDto: CreateUserDto) {
    try {
      const newuser = this.prisma.user.create({
        data: createUserDto,
        select: {
          name: true,
          username: true,
          age: true,
        },
      });

      return newuser;
    } catch (error) {
      console.error('Error creating user:', error);

      throw new InternalServerErrorException('Failed to register user');
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: loginUserDto.username,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Password check
      if (user.password !== loginUserDto.password) {
        throw new BadRequestException('Invalid password');
      }

      const token = await this.jwtAuthSeervice.generateToken({
        sub: user.id,
        username: user.username,
        
      });

      return {
        token: token,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Error login user:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to login user');
    }
  }
}
