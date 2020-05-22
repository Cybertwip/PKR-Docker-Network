import { Test, TestingModule } from '@nestjs/testing';
import { HoldEmService } from './hold-em.service';

describe('HoldEmService', () => {
  let service: HoldEmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoldEmService],
    }).compile();

    service = module.get<HoldEmService>(HoldEmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
