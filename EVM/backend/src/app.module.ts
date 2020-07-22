import { Global, Module } from '@nestjs/common';
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
import { HoldEmService } from './hold-em/hold-em.service';

import { BullModule } from '@nestjs/bull';

import { QueueModule } from "./hold-em/queue/queue.module"
import { QueueService } from "./hold-em/queue/queue.service"

import { JwtStrategy } from './auth/jwt.strategy';

import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthConfig } from './auth/auth.config';

import configuration from '../config'


@Global()
@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        expandVariables: true,
        load: [ configuration ]
      }
    ),

    QueueModule,
    AgreementModule,
    WalletModule,
    HoldEmModule,
    AuthModule
  ],
  controllers: [
    AppController,
    UsersController,
    DepositsController,
    DispersionsController,
    HoldEmController,
    AuthController,
  ],
  providers: [AppService, UsersService, HoldEmService,  AuthService, AuthConfig, JwtStrategy, WalletService, DispersionsService]
})
export class AppModule { }
