
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { WalletService } from '../wallet/wallet.service';
import { AgreementModule } from './agreement.module';
import { AgreementService } from './agreement.service';
import { Agreement } from './interfaces/agreement.interface';
import { WalletModule } from '../wallet/wallet.module';


describe('Agreement', () => {
  let app: INestApplication;
  let agreementService = { create: () => {} };
  let agreement: Agreement = {
    id: 'AGR-000',
    type: 'dispersion',
    owner: 'admin',
    rules: {
      humanReadable:         [
        "deposit amount should be greater than 10000",
        "20% goes to account 123",
        "80% goes to account 456",
      ],
      machineReadable: [
        {
          minAmmount: 10000,
          distribution: [
            { account: 123, percentage: 20 },
            { account: 456, percentage: 80 },
          ],
        },
      ],
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AgreementModule, ConfigModule, WalletModule]
    })
      .overrideProvider(AgreementService)
      .useValue(agreementService)
      .compile();

    app = moduleRef.createNestApplication();
    app = await app.init();
  });

  it(`/POST agreement`, () => {
    return request(app.getHttpServer())
      .post('/agreement')
      .send(agreement)
      .expect(201) 
  });

  afterAll(async () => {
    await app.close();
  });
});