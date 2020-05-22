import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletService } from './wallet.service';

@Module({
    imports: [ConfigModule],
    providers: [WalletService]
})
export class WalletModule {}
