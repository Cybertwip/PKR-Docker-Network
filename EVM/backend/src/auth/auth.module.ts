import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthConfig } from './auth.config';

@Module({
  providers: [AuthService, AuthConfig]
})
export class AuthModule {}
