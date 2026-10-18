
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class JwtAuthService {
  private readonly logger = new Logger(JwtAuthService.name);

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(
    payload: JwtPayload,
  ): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload);
    } catch (error) {
      this.logger.error('Failed to generate JWT');

      throw new InternalServerErrorException(
        'Failed to generate token',
      );
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(
        token,
      );
    } catch {
      throw new InternalServerErrorException(
        'Token verification failed',
      );
    }
  }
}
