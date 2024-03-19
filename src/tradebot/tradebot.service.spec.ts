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
import * as dotenv from 'dotenv';
dotenv.config();

describe('TradebotService', () => {
  let service: TradebotService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    console.log();
  });

  it('should create', async () => {
    const tradebot = await service.create();
    expect(tradebot).toBeInstanceOf(Tradebot);
  });

  it('should create tradebot with private key', async () => {
    const tradebot = await service.create();
    console.log(tradebot);
    expect(tradebot).toBeInstanceOf(Tradebot);
  });

  it('should get all tradebots', async () => {
    const tradebot1 = await service.create();
    const tradebot2 = await service.create();
    const result = await service.getAllTradebots();
    expect(result).toEqual([tradebot1, tradebot2]);
  });

  it('should get tradebot by id', async () => {
    const createTradebot = await service.create();
    const returnTradebot = await service.getTradebotById(createTradebot.id);
    expect(returnTradebot).toBe(createTradebot);
  });

  it('should receive deposit for tradebot', async () => {
    const createTradebot = await service.create();
    const result = await service.receiveDeposit(createTradebot);
    expect(result.returnDeposit.success).toBeTruthy();
  });

  it('should execute trade strategy', async () => {
    const tradebot = await service.create();
    await service.receiveDeposit(tradebot);
    const result = await service.executeStrategy(tradebot, 'ETH-USDT');
    expect(result).toBeDefined();
  });
});
