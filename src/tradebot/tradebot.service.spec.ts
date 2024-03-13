import { Test, TestingModule } from '@nestjs/testing';
import { TradebotService } from './tradebot.service';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { TransactionService } from '../transaction/transaction.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { UserService } from '../user/user.service';
import { StrategiesService } from '../strategies/strategies.service';
import { DewtService } from '../dewt/dewt.service';
import { StrategiesModule } from '../strategies/strategies.module';
import { DewtModule } from '../dewt/dewt.module';
import { TransactionModule } from '../transaction/transaction.module';

describe('TradebotService', () => {
  let service: TradebotService;
  let DEWT: string;
  let privateKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PriceTickerModule,
        StrategiesModule,
        DewtModule,
        TransactionModule,
        UserModule,
        HttpModule,
      ],
      providers: [
        TradebotService,
        PriceTickerService,
        StrategiesService,
        DewtService,
        TransactionService,
        UserService,
      ],
    }).compile();

    service = module.get<TradebotService>(TradebotService);
    DEWT =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94ae9e40094e03414cc97773cdc78d3ce6103bd66a8465f299cb8465f1484b.916278169bc851d4d1f515b900f3294b47517f1835525709fae14849608171b4588f5facea7ec910b5b055feadecea2e5d005a46bf17f07d8940b7972aecb5461b';
    privateKey =
      '54405e07a12ece2ff6abcf56b955343b671ba2913bae5474433ee03aa5b912d9';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create', () => {
    const tradebot = service.create();
    console.log('🚀 ~ it ~ result:', tradebot);
  });

  it('should create tradebot with private key', () => {
    const tradebot = service.create(privateKey);
    console.log('🚀 ~ it ~ result:', tradebot);
  });

  it('should get all tradebots', async () => {
    const tradebot1 = await service.create();
    const tradebot2 = await service.create();
    const result = service.getAllTradebots();
    console.log('🚀 ~ it ~ result:', result);
  });

  it('should get tradebot by id', async () => {
    const tradebot = await service.create(privateKey);
    const result = service.getTradebotById(tradebot.id);
    // will wrong because trade bot live in memory now
    expect(result).toBe(tradebot);
  });

  it('should receive deposit for tradebot', () => {
    const tradebot = service.getTradebotById('jehrgl');
    const result = service.receiveDeposit(tradebot);
    console.log('🚀 ~ it ~ result:', result);
  });

  it('should execute trade strategy', async () => {
    const tradebot = await service.create(privateKey);
    const receiveDeposit = await service.receiveDeposit(tradebot);
    const result = await service.executeStrategy(tradebot, 'ETH-USDT');
    console.log('🚀 ~ it ~ result:', result);
  });
  it('should execute close strategy', async () => {)};
});
