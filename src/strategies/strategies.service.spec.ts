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

  it('should run executeStrategy', () => {
    const suggestion = 'BUY';
    const holdingStatus = 'BUY';
    const openPrice = 100;
    const currentPrice = 121;
    const openSpreadFee = 0.1 * openPrice;
    const stopLoss = 0.7;
    const takeProfit = 2;
    const result = strategiesService.executeStrategy(
      suggestion,
      holdingStatus,
      openPrice,
      currentPrice,
      openSpreadFee,
      stopLoss,
      takeProfit,
    );
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
    const columnData = rows.map((row) => {
      const columns = row.split(','); // Split by comma (adjust delimiter as necessary)
      return parseFloat(columns[closeIndex]);
    });
    // console.log(columnData);
    const { tradeArray } = strategiesService.backTesting(1.7, 2.2, columnData);
    const profitArray = tradeArray.map((trade) => trade.profit);
    const sum = profitArray.reduce((total, profit) => total + profit, 0);
    console.log('Sum:', sum);
  });

  it('should backtest use api', async () => {
    const ETHPriceArray = await priceTickerService.getCandlesticks(
      'ETH-USDT',
      '5m',
    );
    const { tradeArray } = strategiesService.backTesting(
      1.6,
      2.1,
      ETHPriceArray,
    );
    const profitArray = tradeArray.map((trade) => trade.profit);
    const sum = profitArray.reduce((total, profit) => total + profit, 0);
    console.log('🚀 ~ it ~ sum:', sum);
  });
});
