
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthService } from '../../config/jwt/jwt.service.js';

@Injectable()
export class JwtguardGuard implements CanActivate {
  constructor(private readonly jwtService: JwtAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }

    try {
      return Boolean(this.jwtService.verifyToken(token));
    } catch {
      throw new UnauthorizedException('Invalid or expired JWT token');
    }
  }
}
