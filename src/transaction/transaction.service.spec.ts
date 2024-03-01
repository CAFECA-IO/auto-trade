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
  it('should get my asset', async () => {
    const DEWT =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94c76d6c61dfa7dbb7700ad3ed390e5eaf98337a74847b568b808465e16180.13e8aa7e968c61a88c7c3fb00e0d5fffd51bf3ad06bbcef3d1b2555c3260ab432435443693de13563e20d2f9cdbc38f6f90ca0f42542ae223ff6126abcf835071b.18d4180e41b34c27f5785a07c7607dc3a6e14ad89d7493a802ad4d3714ef02b96111f3c2b8b6083226b25d30d12f24d1170178bc677b422c128c8f541c6f52451c';
    const myAsset = await service.getMyAsset(DEWT);
    console.log(myAsset);
  });
  // it('should create CFD order', () => {
  //   const createDepositDto = new CreateDepositDto();
  //   const DEWT =
  //     'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9462ca3ace6ee83aa87fcaf11c20e72c7175daa1648467578cc58465323bc5.42a96816d7c38b9ac03a8c49f916130411f417764d64283ff256e08a951a1bbc7fae23ab4c06644e0898918dcb6f3a92fc412d9aa7fd2743ed1e260b88a005ce1c';
  //   const privatekey =
  //     '54405e07a12ece2ff6abcf56b955343b671ba2913bae5474433ee03aa5b912d9';
  //   const createCFDTrade = service.createCFDOrder(
  //     'BUY',
  //     DEWT,
  //     createDepositDto,
  //     0.5,
  //     privatekey,
  //   );
  //   console.log(createCFDTrade);
  // });
});
