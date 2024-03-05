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
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9462ca3ace6ee83aa87fcaf11c20e72c7175daa1648467578cc58465323bc5.42a96816d7c38b9ac03a8c49f916130411f417764d64283ff256e08a951a1bbc7fae23ab4c06644e0898918dcb6f3a92fc412d9aa7fd2743ed1e260b88a005ce1c';
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
    const createCFDOrderDto = new CreateCFDOrderDTO();
    // const typeOfPosition = 'SELL';
    // const quotation = await priceTickerService.getCFDQuotation(typeOfPosition);
    // const myAsset = await userService.getMyAsset(DEWT);
    // console.log(quotation);
    // createCFDOrderDto.instId = quotation.data.instId;
    // createCFDOrderDto.quotation = quotation.data;
    // createCFDOrderDto.typeOfPosition = typeOfPosition;
    // createCFDOrderDto.price = quotation.data.price;
    // createCFDOrderDto.amount = '10';
    // createCFDOrderDto.targetAsset = quotation.data.targetAsset;
    // createCFDOrderDto.unitAsset = quotation.data.unitAsset;
    createCFDOrderDto.margin = {
      // asset: myAsset.data.currency,
      // amount: SafeMath.toSmallestUnit(myAsset.data.balance.locked, 10),
      asset: 'USDT',
      amount: 500,
    };
    createCFDOrderDto.leverage = 5;
    // createCFDOrderDto.liquidationPrice = SafeMath.toSmallestUnit(
    //   quotation.data.price,
    //   10,
    // );
    createCFDOrderDto.liquidationTime = getTimestamp() + 86400;
    createCFDOrderDto.guaranteedStop = false;
    createCFDOrderDto.fee = 0;
    console.log(createCFDOrderDto);
    const createCFDTrade = await transactionService.createCFDOrder(
      privateKey,
      DEWT,
      createCFDOrderDto,
    );
    console.log(createCFDTrade);
  });
});
