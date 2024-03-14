import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Deposit } from './entities/deposit.entity';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { HttpModule } from '@nestjs/axios';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { CreateCFDOrderDTO } from './dto/createCFDOrder.dto';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { getTimestamp } from '../common/common';
import { SafeMath } from '../common/safe_math';
import { QuotationDto } from 'src/price_ticker/dto/quotation.dto';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let priceTickerService: PriceTickerService;
  let userService: UserService;
  let DEWT: string;
  let privateKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PriceTickerModule, HttpModule, UserModule],
      providers: [TransactionService, PriceTickerService, UserService],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    priceTickerService = module.get<PriceTickerService>(PriceTickerService);
    userService = module.get<UserService>(UserService);
    DEWT =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94ae9e40094e03414cc97773cdc78d3ce6103bd66a8465f299cb8465f1484b.916278169bc851d4d1f515b900f3294b47517f1835525709fae14849608171b4588f5facea7ec910b5b055feadecea2e5d005a46bf17f07d8940b7972aecb5461b';
    privateKey =
      '54405e07a12ece2ff6abcf56b955343b671ba2913bae5474433ee03aa5b912d9';
  });

  it('should be deposit', async () => {
    const deposit = await transactionService.deposit(DEWT);
    console.log(deposit);
    // expect(service).toBeDefined();
  });
  it('should create CFD order', async () => {
    const typeOfPosition = 'SELL';
    // should fake a quotation
    const quotation = await priceTickerService.getCFDQuotation(typeOfPosition);
    const amount = 0.03;
    const createCFDTrade = await transactionService.createCFDOrder(
      DEWT,
      privateKey,
      quotation,
      amount,
    );
    console.log(createCFDTrade);
  });

  it('should close CFD order', async () => {
    // should fake a quotation
    const typeOfPosition = 'BUY';
    const quotation = await priceTickerService.getCFDQuotation(typeOfPosition);
    const closeCFDOrder = await transactionService.closeCFDOrder(
      DEWT,
      privateKey,
      quotation,
      '0x78ff8bc97857e6e49bc84ccf4c59191d',
    );
    console.log(closeCFDOrder);
  });
  it('should calculate amount', async () => {
    const amount = transactionService.calculateAmount(4000);
    console.log(amount);
  });
});
