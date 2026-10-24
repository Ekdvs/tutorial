import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { PrismaModule } from '../../config/prisma/prisma.module.js';
import { JwtAuthModule } from '../../config/jwt/jwt.module.js';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
