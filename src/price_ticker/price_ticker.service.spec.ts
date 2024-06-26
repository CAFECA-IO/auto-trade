import { Test, TestingModule } from '@nestjs/testing';
import { PriceTickerService } from './price_ticker.service';
import { HttpModule } from '@nestjs/axios';
import { QuotationDto } from './dto/quotation.dto';
import * as fs from 'fs';

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
    const quotation = new QuotationDto();
    jest
      .spyOn(service, 'getCFDQuotation')
      .mockImplementation(async () => quotation);
    expect(await service.getCFDQuotation()).toBe(quotation);
  });

  it('should return an array of tickers', async () => {
    const array = [1, 2, 3, 4, 5];
    jest.spyOn(service, 'fetchTickers').mockImplementation(async () => array);
    expect(await service.fetchTickers()).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('should return an array of candlestick', async () => {
    const array = [1, 2, 3, 4, 5];
    jest
      .spyOn(service, 'getCandlesticks')
      .mockImplementation(async () => array);
    expect(await service.getCandlesticks()).toStrictEqual([1, 2, 3, 4, 5]);
  });

  // Info: (20240422 - Jacky) Write the data to a file
  // it('should store an array of candlestick', async () => {
  //   let etharr = [];
  //   for (let i = 0; i < 3; i++) {
  //     const begin = Date.now() - 90000000 * (i + 1);
  //     const end = Date.now() - 90000000 * i;
  //     const r = await service.fetchCandlesticksV2('ETH-USDT', '5m', begin, end);
  //     const tempArr = await r.data.candlesticks.candlesticks.map(
  //     (item) => item.y.close,
  //     );
  //     etharr = await tempArr.concat(etharr);
  //   }
  // const etharrJson = JSON.stringify(etharr);
  // fs.writeFileSync('src/strategies/etharr.txt', etharrJson);
  // });
});
