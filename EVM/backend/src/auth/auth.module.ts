import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthConfig } from './auth.config';
import { UsersService } from './../users/users.service'
import { WalletService } from './../wallet/wallet.service'

@Module({
  providers: [AuthService, AuthConfig, UsersService, WalletService]
})
export class AuthModule {}
