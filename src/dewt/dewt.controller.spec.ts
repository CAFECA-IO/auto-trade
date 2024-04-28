import { Test, TestingModule } from '@nestjs/testing';
import { DewtController } from './dewt.controller';
import { DewtService } from './dewt.service';

describe('DewtController', () => {
  let controller: DewtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DewtController],
      providers: [DewtService],
    }).compile();

    controller = module.get<DewtController>(DewtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
