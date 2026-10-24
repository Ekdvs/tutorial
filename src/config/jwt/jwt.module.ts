import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service.js';
import { JwtGuard } from '../../guard/jwtguard/jwtguard.guard.js';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtAuthService,
  ],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
