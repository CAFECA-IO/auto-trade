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
    const result = await service.getCFDQuotation();
    console.log(result['data']['price']);
    // result.subscribe((val) => console.log(val));
  });
});
