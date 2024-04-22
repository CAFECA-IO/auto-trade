import { Test, TestingModule } from '@nestjs/testing';
import { PriceTickerController } from './price_ticker.controller';
import { PriceTickerService } from './price_ticker.service';
import { HttpModule } from '@nestjs/axios';

describe('PriceTickerController', () => {
  let controller: PriceTickerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PriceTickerController],
      providers: [PriceTickerService],
    }).compile();

    controller = module.get<PriceTickerController>(PriceTickerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
