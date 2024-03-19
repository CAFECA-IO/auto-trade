import { Test, TestingModule } from '@nestjs/testing';
import { StrategiesService } from './strategies.service';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { QuotationDto } from '../price_ticker/dto/quotation.dto';
import { HttpModule } from '@nestjs/axios';
import * as fs from 'fs';

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
    const ETHSuggestion = await strategiesService.getSuggestion('autoArima', {
      priceArray: ETHPriceArray,
      spreadFee: ETHQuotation.data.spreadFee,
    });
    const BTCSuggestion = await strategiesService.getSuggestion('autoArima', {
      priceArray: BTCPriceArray,
      spreadFee: BTCQuotation.data.spreadFee,
    });
    console.log(ETHSuggestion);
    console.log(BTCSuggestion);
  });

  it('should run executeStrategy', async () => {
    const suggestion = 'BUY';
    const holdingStatus = 'SELL';
    const result = await strategiesService.getTradeStrategy('autoArima', {
      suggestion: suggestion,
      holdingStatus: holdingStatus,
    });
    console.log(result);
  });

  it('should run takeProfit', async () => {
    const openPrice = 100;
    const currentPrice = 120;
    const spreadFee = 5;
    const holdingStatus = 'BUY';
    const result = await strategiesService.getTakeProfit('autoArima', {
      openPrice,
      currentPrice,
      spreadFee,
      holdingStatus,
    });
    console.log(result);
  });

  it('should run stopLoss', async () => {
    const openPrice = 100;
    const currentPrice = 80;
    const spreadFee = 5;
    const holdingStatus = 'BUY';
    const result = await strategiesService.getStopLoss('autoArima', {
      openPrice,
      currentPrice,
      spreadFee,
      holdingStatus,
    });
    console.log(result);
  });

  it('should backtest use csv', async () => {
    // Read the file
    const csvContent = fs.readFileSync('src/strategies/ETH-USD.csv', 'utf8');
    // Split the content into rows (assuming newline-separated rows)
    const rows = csvContent.split('\n');
    // Define the index of the column you want to read
    const closeIndex = 4;
    // const dateIndex = 0;
    // Extract the data from the specified column
    const priceData = rows.map((row) => {
      const columns = row.split(','); // Split by comma (adjust delimiter as necessary)
      return parseFloat(columns[closeIndex]);
    });
    const { tradeArray } = await strategiesService.backTesting(
      'autoArima',
      'autoArima',
      'autoArima',
      'autoArima',
      priceData,
    );
    const profitArray = tradeArray.map((trade) => trade.profit);
    const sum = profitArray.reduce((total, profit) => total + profit, 0);
    console.log('Sum:', sum);
  });

  it('should backtest use api', async () => {
    const ETHPriceArray = await priceTickerService.getCandlesticks(
      'ETH-USDT',
      '5m',
    );
    const { tradeArray } = await strategiesService.backTesting(
      'autoArima',
      'autoArima',
      'autoArima',
      'autoArima',
      ETHPriceArray,
    );
    const profitArray = tradeArray.map((trade) => trade.profit);
    const sum = profitArray.reduce((total, profit) => total + profit, 0);
    console.log('🚀 ~ it ~ sum:', sum);
  });
});
