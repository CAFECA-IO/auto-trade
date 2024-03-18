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
import { Tradebot } from './entities/tradebot.entity';

describe('TradebotService', () => {
  let service: TradebotService;
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
    privateKey =
      '54405e07a12ece2ff6abcf56b955343b671ba2913bae5474433ee03aa5b912d9';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create', async () => {
    const tradebot = await service.create();
    expect(tradebot).toBeDefined();
  });

  it('should create tradebot with private key', async () => {
    const tradebot = await service.create(privateKey);
    expect(tradebot).toBeInstanceOf(Tradebot);
  });

  it('should get all tradebots', async () => {
    const tradebot1 = await service.create();
    const tradebot2 = await service.create();
    const result = service.getAllTradebots();
    expect(result).toEqual([tradebot1, tradebot2]);
  });

  it('should get tradebot by id', async () => {
    const creatTradebot = await service.create(privateKey);
    const returnTradebot = service.getTradebotById(creatTradebot.id);
    // will wrong because trade bot live in memory now
    expect(returnTradebot).toBe(creatTradebot);
  });

  it('should receive deposit for tradebot', async () => {
    const tradebot = service.getTradebotById('jehrgl');
    const result = await service.receiveDeposit(tradebot);
    expect(result.returnDeposit.success).toBeTruthy();
  });

  it('should execute trade strategy', async () => {
    const tradebot = await service.create(privateKey);
    await service.receiveDeposit(tradebot);
    const result = await service.executeStrategy(
      'autoArima',
      tradebot,
      'ETH-USDT',
    );
    expect(result).toBeDefined();
  });
});
