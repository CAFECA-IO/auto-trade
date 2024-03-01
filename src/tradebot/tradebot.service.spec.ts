import { Test, TestingModule } from '@nestjs/testing';
import { TradebotService } from './tradebot.service';

describe('TradebotService', () => {
  let service: TradebotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradebotService],
    }).compile();

    service = module.get<TradebotService>(TradebotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
