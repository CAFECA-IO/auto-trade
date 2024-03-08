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

  it('should return quotation', async () => {
    const res = await service.getCFDQuotation('SELL');
    console.log(res);
    expect(res).toBeDefined();
  });

  it('should return an array of price tickers', async () => {
    const ETHdataArray: number[] = await service.getTickers('ETH-USDT');
    const BTCdataArray: number[] = await service.getTickers('BTC-USDT');
    console.log(ETHdataArray);
    console.log(BTCdataArray);
    // expect(res).toBeDefined();
  });
});
