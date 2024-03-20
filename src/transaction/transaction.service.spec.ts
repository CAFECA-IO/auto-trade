import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { HttpModule } from '@nestjs/axios';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { QuotationDto } from '../price_ticker/dto/quotation.dto';
import { ReturnCreateCFDOrderDto } from './dto/returnCreateCFDOrder.dto';
import { ReturnCloseCFDOrderDto } from './dto/returnCloseCFDOrder.dto';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let DEWT: string;
  let privateKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PriceTickerModule, HttpModule],
      providers: [TransactionService, PriceTickerService],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    DEWT =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94a0a78676e23c82516de3e4c058a2a9809c42cf8c8465fbbaf98465fa6979.c9888a50fe5f66f1dd460bb5e3c83bcfc12e9e0e925be942d3aa7ea00f61844c1e5c2037b6b63f83f04a033a0f4b34d705e86e55682405119745db09b16eaf381c';
    privateKey =
      '9fbe1e99f1649be1160ec2442537ebd86cd09061582c6f3cd0a3ca5144fae2d7';
  });

  it('should be deposit', async () => {
    const deposit = {
      success: true,
      code: '00000000',
      reason: 'ERROR_MESSAGE.SUCCESS',
      data: {
        id: '65fa5ad9ee77741ff3c4fb84',
        userAddress: '0xa0a78676E23c82516De3e4C058a2A9809C42cf8c',
        txhash: '0xa2583c0390442177542c06f300f38258',
        targetAsset: 'USDT',
        targetAmount: '100',
        ethereumTxHash: '0x123',
        orderType: 'DEPOSIT',
        orderStatus: 'SUCCESS',
        createTimestamp: 1710906073,
        updatedTimestamp: 1710906073,
      },
    };
    jest
      .spyOn(transactionService, 'deposit')
      .mockImplementation(async () => deposit);
    expect(await transactionService.deposit(DEWT)).toBe(deposit);
  });
  it('should create CFD order', async () => {
    const quotation = new QuotationDto();
    const amount = 0.03;
    const createCFDTrade = new ReturnCreateCFDOrderDto();
    jest
      .spyOn(transactionService, 'createCFDOrder')
      .mockImplementation(async () => createCFDTrade);
    expect(
      await transactionService.createCFDOrder(
        DEWT,
        privateKey,
        quotation,
        amount,
      ),
    ).toBe(createCFDTrade);
  });

  it('should close CFD order', async () => {
    const quotation = new QuotationDto();
    const closeCFDOrder = new ReturnCloseCFDOrderDto();
    jest
      .spyOn(transactionService, 'closeCFDOrder')
      .mockImplementation(async () => closeCFDOrder);
    expect(
      await transactionService.closeCFDOrder(
        DEWT,
        privateKey,
        quotation,
        '0x404cc1923232b27aa73c13c28007129c',
      ),
    ).toBe(closeCFDOrder);
  });
  it('should calculate amount', async () => {
    const amount = transactionService.calculateAmount(100, 73205);
    expect(amount).toBe(0.0068);
  });
});
