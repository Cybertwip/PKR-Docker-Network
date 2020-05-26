import { Module } from '@nestjs/common';
import { HoldEmController } from './hold-em.controller';
import { HoldEmService } from './hold-em.service';
import { WalletService } from '../wallet/wallet.service';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from '../wallet/wallet.module';
import { AuthService } from '../auth/auth.service';
import { AuthConfig } from '../auth/auth.config';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [ConfigModule, WalletModule, PassportModule.register({ defaultStrategy: 'jwt' })],
	controllers: [HoldEmController],
  	providers: [HoldEmService, WalletService, AuthService, AuthConfig, JwtStrategy]
})
export class HoldEmModule {}
