import { Module } from '@nestjs/common';
import { HoldEmController } from './hold-em.controller';
import { HoldEmService } from './hold-em.service';
import { WalletService } from '../wallet/wallet.service';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from '../wallet/wallet.module';

@Module({
	imports: [ConfigModule, WalletModule],
	controllers: [HoldEmController],
  	providers: [HoldEmService, WalletService]
})
export class HoldEmModule {}
