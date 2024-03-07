import { Test, TestingModule } from '@nestjs/testing';
import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';

describe('StrategiesController', () => {
  let controller: StrategiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StrategiesController],
      providers: [StrategiesService],
    }).compile();

    controller = module.get<StrategiesController>(StrategiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
