import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgreementModule } from './agreement/agreement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepositsController } from './deposits/deposits.controller';
import { DispersionsController } from './dispersions/dispersions.controller';
import { DispersionsService } from './dispersions/dispersions.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { WalletService } from './wallet/wallet.service';
import { WalletModule } from './wallet/wallet.module';
import { HoldEmController } from './hold-em/hold-em.controller';
import { HoldEmModule } from './hold-em/hold-em.module';
import configuration from '../config'


@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        expandVariables: true,
        load: [ configuration ]
      }
    ),
    AgreementModule,
    WalletModule,
    HoldEmModule,
  ],
  controllers: [
    AppController,
    UsersController,
    DepositsController,
    DispersionsController,
    HoldEmController,
  ],
  providers: [AppService, UsersService, WalletService, DispersionsService],
})
export class AppModule { }
