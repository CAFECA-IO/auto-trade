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

  it('should return an array of price tickers by findall', async () => {
    const res = await service.getCFDQuotation('SELL');
    await console.log(res);
    expect(res).toBeDefined();
  });
});
