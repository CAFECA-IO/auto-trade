import { Test, TestingModule } from '@nestjs/testing';
import { PriceTickerService } from './price_ticker.service';
import { HttpModule } from '@nestjs/axios';
import { CandlestickDto } from './dto/candlestick.dto';
import { QuotationDto } from './dto/quotation.dto';

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

  it('should return an array of candlestick', async () => {
    const array = [1, 2, 3, 4, 5];
    jest
      .spyOn(service, 'getCandlesticks')
      .mockImplementation(async () => array);
    expect(await service.getCandlesticks()).toStrictEqual([1, 2, 3, 4, 5]);
  });
});
