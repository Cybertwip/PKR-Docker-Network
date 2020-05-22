import { Test, TestingModule } from '@nestjs/testing';
import { DispersionsController } from './dispersions.controller';

describe('Dispersions Controller', () => {
  let controller: DispersionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispersionsController],
    }).compile();

    controller = module.get<DispersionsController>(DispersionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
