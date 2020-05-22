import { Module } from '@nestjs/common';
import { AgreementController } from './agreement.controller';
import { AgreementService } from './agreement.service';
import { WalletService } from '../wallet/wallet.service';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [ConfigModule, WalletModule],
  controllers: [AgreementController],
  providers: [AgreementService, WalletService]
})
export class AgreementModule {}
