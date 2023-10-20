import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Deposit } from './entities/deposit.entity';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { HttpModule } from '@nestjs/axios';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PriceTickerModule, HttpModule],
      providers: [TransactionService],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be deposit', () => {
    const createDepositDto = new CreateDepositDto();
    const DEWT =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9462ca3ace6ee83aa87fcaf11c20e72c7175daa1648467578dd18465323cd1.92689d62c480dd38f7ba2064b74723529b1b301fb09402107b2daa4c628f09cf6da0971db03dd83cb283b2e0e97b7d804e31cc04fedeb09c63038c442ec7b5ec1c';
    createDepositDto.blockchain = 'ETH';
    createDepositDto.txhash = '0x123';
    createDepositDto.targetAsset = 'USDT';
    createDepositDto.targetAmount = 100;
    const deposit = service.deposit(DEWT, createDepositDto);
    console.log(deposit);
    // expect(service).toBeDefined();
  });
  it('should create CFD order', () => {
    const createDepositDto = new CreateDepositDto();
    const DEWT =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9462ca3ace6ee83aa87fcaf11c20e72c7175daa1648467578cc58465323bc5.42a96816d7c38b9ac03a8c49f916130411f417764d64283ff256e08a951a1bbc7fae23ab4c06644e0898918dcb6f3a92fc412d9aa7fd2743ed1e260b88a005ce1c';
    const privatekey =
      '54405e07a12ece2ff6abcf56b955343b671ba2913bae5474433ee03aa5b912d9';
    const createCFDTrade = service.createCFDOrder(
      'BUY',
      DEWT,
      createDepositDto,
      0.5,
      privatekey,
    );
    console.log(createCFDTrade);
  });
});
