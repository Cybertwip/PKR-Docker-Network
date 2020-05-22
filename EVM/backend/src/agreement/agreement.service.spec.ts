import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../wallet/wallet.service';
import { AgreementService } from './agreement.service';
import { Agreement } from './interfaces/agreement.interface';

describe('AgreementService', () => {
  let service: AgreementService;
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
      imports: [ConfigModule],
      providers: [AgreementService, WalletService],
    }).compile();

    service = module.get<AgreementService>(AgreementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an agreement contract', () => {
    expect(() => service.create(agreement)).not.toThrow()
  })
});
