
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service.js';

@Module({
  imports: [
    JwtModule.register(
      {
        secret: "your-secret-key",
        signOptions: { expiresIn: '1h' },
        global: true,
      }
    ),
  ],
  
  providers: [JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
