import { Test, TestingModule } from '@nestjs/testing';
import { HoldEmController } from './hold-em.controller';

describe('HoldEm Controller', () => {
  let controller: HoldEmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoldEmController],
    }).compile();

    controller = module.get<HoldEmController>(HoldEmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
