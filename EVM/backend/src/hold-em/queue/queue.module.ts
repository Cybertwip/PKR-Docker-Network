import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { QueueProcessor } from './queue.processor';
import { QueueService } from './queue.service';
import { HoldEmService } from "./../hold-em.service"

import { WalletService } from '../../wallet/wallet.service';
import { WalletModule } from '../../wallet/wallet.module';

const DynamicQueueModule = BullModule.registerQueue({
  name: 'queue',
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

@Global()
@Module({
  imports: [
    DynamicQueueModule,
    WalletModule
  ],
  providers: [QueueProcessor, QueueService, WalletService],
  exports:[QueueService, DynamicQueueModule]
})
export class QueueModule {}