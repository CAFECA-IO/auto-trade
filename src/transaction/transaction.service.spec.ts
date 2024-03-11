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
      'f8858b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94c76d6c61dfa7dbb7700ad3ed390e5eaf98337a748508c7b2e1618465ee7961.525809798fe6c1028aa4c32d28cc47b3683da0b7e954b18659c2b127e98cf96825c6693e5c355c5e72f9a1558be632fb89c5bf07006061afb03b1a894b2eb0b01c';
    privateKey =
      '54405e07a12ece2ff6abcf56b955343b671ba2913bae5474433ee03aa5b912d9';
  });

  it('should be deposit', () => {
    const createDepositDto = new CreateDepositDto();
    createDepositDto.blockchain = 'ETH';
    createDepositDto.txhash = '0x123';
    createDepositDto.targetAsset = 'USDT';
    createDepositDto.targetAmount = 100;
    const deposit = transactionService.deposit(DEWT, createDepositDto);
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
      '0x7436b8e494d9d03ad4d8a6fd647f00d8',
    );
    console.log(closeCFDOrder);
  });
});
