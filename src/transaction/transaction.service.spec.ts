import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { HttpModule } from '@nestjs/axios';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { PriceTickerService } from '../price_ticker/price_ticker.service';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let priceTickerService: PriceTickerService;
  let DEWT: string;
  let privateKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PriceTickerModule, HttpModule],
      providers: [TransactionService, PriceTickerService],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    priceTickerService = module.get<PriceTickerService>(PriceTickerService);
    DEWT =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d947df0ddb74cc890cf00a21d4861303b54e21ecbea8465f562d58465f41155.74ff998fd17ea5d9370ca72ab23499efc6f3ea2cfefb018cd149c37f5f5bf828381df48520a1ceca1caff066eed164c6e855f5ec9d84ee895506518585fb69321b';
    privateKey =
      '9fbe1e99f1649be1160ec2442537ebd86cd09061582c6f3cd0a3ca5144fae2d7';
  });

  it('should be deposit', async () => {
    const deposit = await transactionService.deposit(DEWT);
    console.log(deposit);
    // expect(deposit.success).toBeTruthy();
  });
  it('should create CFD order', async () => {
    const typeOfPosition = 'SELL';
    // Info: (20240315 Jacky) should fake an API return
    const quotation = await priceTickerService.getCFDQuotation(typeOfPosition);
    const amount = 0.03;
    const createCFDTrade = await transactionService.createCFDOrder(
      DEWT,
      privateKey,
      quotation,
      amount,
    );
    expect(createCFDTrade.success).toBeTruthy();
  });

  it('should close CFD order', async () => {
    // Info: (20240315 Jacky) should fake an API return
    const typeOfPosition = 'SELL';
    const quotation = await priceTickerService.getCFDQuotation(typeOfPosition);
    const closeCFDOrder = await transactionService.closeCFDOrder(
      DEWT,
      privateKey,
      quotation,
      '0xa06887cae3b99c21c3e6c5788b261505',
    );
    expect(closeCFDOrder.success).toBeTruthy();
  });
  it('should calculate amount', async () => {
    const amount = transactionService.calculateAmount(100, 73205);
    expect(amount).toBe(0.0068);
  });
});
