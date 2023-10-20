import { Test, TestingModule } from '@nestjs/testing';
import { PriceTickerService } from './price_ticker.service';
import { HttpModule } from '@nestjs/axios';

describe('PriceTickerService', () => {
  let service: PriceTickerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PriceTickerService],
    }).compile();

    service = module.get<PriceTickerService>(PriceTickerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of price tickers', async () => {
    const result1 = await service.getCFDQuotation('SELL');
    console.log(result1);
    const result2 = await service.getCFDQuotation('BUY');
    console.log(result2);
    // result.subscribe((val) => console.log(val));
  });
});
