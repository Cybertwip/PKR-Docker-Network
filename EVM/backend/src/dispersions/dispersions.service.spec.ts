import { Test, TestingModule } from '@nestjs/testing';
import { DispersionsService } from './dispersions.service';

describe('DispersionsService', () => {
  let service: DispersionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispersionsService],
    }).compile();

    service = module.get<DispersionsService>(DispersionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
