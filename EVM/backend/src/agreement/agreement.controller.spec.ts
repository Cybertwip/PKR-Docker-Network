import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../wallet/wallet.service';
import { AgreementController } from './agreement.controller';
import { AgreementService } from './agreement.service';
import { Agreement } from './interfaces/agreement.interface';

describe('Agreement Controller', () => {
  let controller: AgreementController;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ ConfigModule ],
      controllers: [AgreementController],
      providers: [ AgreementService , WalletService],
    }).compile();

    controller = module.get<AgreementController>(AgreementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should not to throw', () => {
    expect(controller.create(agreement))
  })
});
