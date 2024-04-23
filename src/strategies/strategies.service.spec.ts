import { Test, TestingModule } from '@nestjs/testing';
import { StrategiesService } from './strategies.service';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { HttpModule } from '@nestjs/axios';
import * as fs from 'fs';

describe('StrategiesService', () => {
  let strategiesService: StrategiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PriceTickerModule, HttpModule],
      providers: [StrategiesService],
    }).compile();

    strategiesService = module.get<StrategiesService>(StrategiesService);
  });

  it('should run autoArima to get suggestion', async () => {
    console.log = () => {};
    const ETHPriceArray = [
      3250.92, 3227.38, 3264, 3252.43, 3277.55, 3264.01, 3280.58, 3260.4,
      3258.96, 3275.94, 3292.73, 3281.7, 3273.62, 3259.7, 3222.2, 3228.48,
      3225.21, 3229.59, 3228, 3230.22, 3245.07, 3244.62, 3227.1, 3213.34,
      3205.78, 3218.81, 3212.59, 3216.6, 3243.82, 3254.6, 3260.18, 3276.6,
      3273.45, 3276.47, 3270, 3289.41, 3278.61, 3257.55, 3272.34, 3264.35,
      3278.03, 3292.56, 3303.6, 3295.36, 3305.09, 3295.91, 3282.62, 3279.36,
      3279.6, 3273.79, 3296.25, 3306.6, 3285.4, 3295.09, 3279.6, 3272.93,
      3277.75, 3292.59, 3260, 3242.66, 3241.78, 3237.8, 3222.6, 3234.3, 3238.34,
      3252.28, 3267.21, 3264.54, 3258.5, 3259.2, 3250.44, 3248.98, 3235.4,
      3245.99, 3257.86, 3251.08, 3277.35, 3295.41, 3312.28, 3323.59, 3308.63,
      3302.98, 3306.66, 3317.32, 3303.59, 3299.27, 3296.26, 3299, 3302.28,
      3315.59, 3324.42, 3323.63, 3332.26, 3327.73, 3338.18, 3332.01, 3341.54,
      3335.91, 3342.99, 3350.09, 3331.74, 3322.51, 3317.57, 3312.87, 3312.96,
      3314.18, 3307.64, 3295.61, 3287, 3304.74, 3301.41, 3306.23, 3311.47,
      3312.52, 3329.5, 3314.01, 3312.61, 3316.38, 3306.79, 3329.9, 3332.61,
      3342.5, 3356, 3344.52, 3334.21, 3342.99, 3339.01, 3332.32, 3327.49,
      3333.23, 3312.47, 3297.72, 3297.61, 3287.31, 3272.79, 3276.98, 3293.86,
      3295.18, 3278.81, 3291.58, 3279.67, 3279.21, 3283.9, 3272.82, 3275.05,
      3282.55, 3262.38, 3273.59, 3273.32, 3280.56, 3284.08, 3298.75, 3294.55,
      3291.02, 3285.03, 3278.96, 3252.62, 3246.18, 3233.95, 3226.14, 3243.15,
      3229.47, 3211.81, 3216.67, 3201.42, 3211.38, 3184.59, 3177.5, 3170.81,
      3174.33, 3155.81, 3159.2, 3173.39, 3162.93, 3162.81, 3175.59, 3163.63,
      3158.4, 3158.05, 3173.82, 3168.86, 3193.39, 3201.67, 3206.98, 3199.53,
      3213.39, 3215.19, 3213.22, 3220.43, 3235.22, 3220.58, 3212.89, 3211.78,
      3188.78, 3168.61, 3188.41, 3174.71, 3175.2, 3164.39, 3179.45, 3187.09,
      3175.39, 3187.27, 3195.52, 3203.25, 3214.48, 3210.22, 3218.77, 3216.85,
      3221, 3221.37, 3225.99, 3216.23, 3224, 3230.16, 3227.6, 3224.2, 3240,
      3251.13, 3263.32, 3253.84, 3248.38, 3232.99, 3210.99, 3197.31, 3160.85,
      3174.81, 3193.03, 3191.8, 3187.52, 3162.31, 3160.3, 3121.62, 3130,
      3119.86, 3133, 3128.61, 3128.84, 3125.61, 3114.78, 3102.2, 3104.79,
      3069.41, 3074, 3087.97, 3096.29, 3098.59, 3092.15, 3095.56, 3110.15,
      3113.2, 3119.41, 3128.17, 3124.95, 3136.15, 3142.86, 3140, 3137.91,
      3144.45, 3143.04, 3146.88, 3140.86, 3148.23, 3154.01, 3160.57, 3165.67,
      3174.26, 3184.2, 3184.82, 3181.76, 3210.49, 3205.48, 3218.07, 3217.91,
      3210.38, 3221.28, 3220.03, 3219.03, 3220.01, 3224.01, 3228.11, 3212.89,
      3211.79, 3224.31, 3216.85, 3207.8, 3224.44, 3220.49, 3212.7, 3219.26,
    ];
    const spreadFee = 5;
    const ETHSuggestion = await strategiesService.getSuggestion('autoArima', {
      currentPrice: 3219.26,
      priceArray: ETHPriceArray,
      spreadFee: spreadFee,
      holdingStatus: 'WAIT',
    });
    expect(ETHSuggestion).toBe('WAIT');
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
    expect(result).toBe('CLOSE');
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
    expect(result).toBe('CLOSE');
  });

  it('should backtest use csv', async () => {
    // console.log = () => {};
    // Read the file
    const csvContent = fs.readFileSync('src/strategies/ETH-USD.csv', 'utf8');
    // Split the content into rows (assuming newline-separated rows)
    const rows = csvContent.split('\n');
    // Define the index of the column you want to read
    const closeIndex = 4;
    // Extract the data from the specified column
    const priceData = rows.map((row) => {
      const columns = row.split(','); // Split by comma (adjust delimiter as necessary)
      return parseFloat(columns[closeIndex]);
    });
    const { tradeArray } = await strategiesService.backTesting(
      'autoArima',
      'autoArima',
      'autoArima',
      priceData,
    );
    // Info: (20240320 - Jacky) this is aim to sum the profit of all trades
    const profitArray = tradeArray.map((trade) => trade.profit);
    const sum = profitArray.reduce((total, profit) => total + profit, 0);
    expect(sum).toBe(-1245.420995175002);
  });

  it('should backtest use api', async () => {
    console.log = () => {};
    const ethArrFile = fs.readFileSync('src/strategies/etharr.txt', 'utf8');
    const etharr = JSON.parse(ethArrFile);
    const { tradeArray } = await strategiesService.backTesting(
      'autoArima',
      'autoArima',
      'autoArima',
      etharr,
    );
    // Info: (20240320 - Jacky) this is aim to sum the profit of all trades
    const profitArray = tradeArray.map((trade) => trade.profit);
    const sum = profitArray.reduce((total, profit) => total + profit, 0);
    expect(sum).toBeTruthy();
  });
});
