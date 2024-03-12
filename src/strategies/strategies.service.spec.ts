import { Test, TestingModule } from '@nestjs/testing';
import { StrategiesService } from './strategies.service';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { QuotationDto } from '../price_ticker/dto/quotation.dto';
import { HttpModule } from '@nestjs/axios';

describe('StrategiesService', () => {
  let strategiesService: StrategiesService;
  let priceTickerService: PriceTickerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PriceTickerModule, HttpModule],
      providers: [StrategiesService, PriceTickerService],
    }).compile();

    strategiesService = module.get<StrategiesService>(StrategiesService);
    priceTickerService = module.get<PriceTickerService>(PriceTickerService);
  });

  it('should run autoARIMA', async () => {
    const ETHQuotation: QuotationDto =
      await priceTickerService.getCFDQuotation('SELL');
    const BTCQuotation: QuotationDto = await priceTickerService.getCFDQuotation(
      'BUY',
      'BTC-USDT',
    );
    const ETHPriceArray = await priceTickerService.getCandlesticks('ETH-USDT');
    const BTCPriceArray = await priceTickerService.getCandlesticks('BTC-USDT');
    const ETHSuggestion = strategiesService.autoARIMASuggestion(
      ETHPriceArray,
      ETHQuotation.data.spreadFee,
    );
    const BTCSuggestion = strategiesService.autoARIMASuggestion(
      BTCPriceArray,
      BTCQuotation.data.spreadFee,
    );
    console.log(ETHSuggestion);
    console.log(BTCSuggestion);
  });
});
