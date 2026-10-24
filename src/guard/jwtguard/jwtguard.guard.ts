import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtAuthService } from '../../config/jwt/jwt.service.js';
import { Roles } from '../../decorator/roles/roles.decorator.js';


@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtAuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Check whether the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'isPublic',
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (isPublic) {
      return true;
    }

    // 2. Get the request
    const request: Request = context.switchToHttp().getRequest();

    // 3. Read the Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    // 4. Extract the JWT
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }

    // 5. Verify the JWT
    let payload: any;

    try {
      payload = this.jwtService.verifyToken(token);

      if (!payload) {
        throw new UnauthorizedException(
          'Invalid or expired JWT token',
        );
      }
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired JWT token',
      );
    }

    // 6. Attach the payload to the request
    (request as Request & { user: typeof payload }).user = payload;

    // 7. Read the required roles
    const requiredRoles = this.reflector.getAllAndOverride(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 8. If no roles are specified, allow authenticated users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 9. Check whether the authenticated user has a required role
    if (!requiredRoles.includes(payload.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}