import { Test, TestingModule } from '@nestjs/testing';
import { TradebotController } from './tradebot.controller';
import { TradebotService } from './tradebot.service';

describe('TradebotController', () => {
  let controller: TradebotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradebotController],
      providers: [TradebotService],
    }).compile();

    controller = module.get<TradebotController>(TradebotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
