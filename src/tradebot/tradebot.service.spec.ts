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
  });

  it('should create', async () => {
    const fakeTradebot = new Tradebot();
    jest.spyOn(service, 'create').mockImplementation(async () => fakeTradebot);
    expect(await service.create()).toBeInstanceOf(Tradebot);
  });

  it('should get all tradebots', async () => {
    const tradebot1 = new Tradebot();
    const tradebot2 = new Tradebot();
    jest
      .spyOn(service, 'getAllTradebots')
      .mockImplementation(async () => [tradebot1, tradebot2]);
    expect(await service.getAllTradebots()).toEqual([tradebot1, tradebot2]);
  });

  it('should get tradebot by id', async () => {
    const tradebot = new Tradebot();
    jest
      .spyOn(service, 'getTradebotById')
      .mockImplementation(async () => tradebot);
    expect(await service.getTradebotById(tradebot.id)).toEqual(tradebot);
  });

  it('should receive deposit for tradebot', async () => {
    const tradebot = new Tradebot();
    jest.spyOn(service, 'receiveDeposit').mockImplementation(async () => ({
      returnDeposit: true,
      tradebot,
    }));
    expect(await service.receiveDeposit(tradebot)).toEqual({
      returnDeposit: true,
      tradebot,
    });
  });

  it('should execute trade strategy', async () => {
    const tradebot = new Tradebot();
    jest
      .spyOn(service, 'executeStrategy')
      .mockImplementation(async () => 'buy');
    expect(await service.executeStrategy(tradebot, 'ETH-USDT')).toBe('buy');
  });

  it('should set Suggestion', async () => {
    const createTradebot = new Tradebot();
    const resultTradebot = new Tradebot();
    resultTradebot.suggestion = 'BUY';
    resultTradebot.stopLoss = '100';
    jest
      .spyOn(service, 'updateTradebot')
      .mockImplementation(async () => resultTradebot);
    const tradebot = await service.updateTradebot(createTradebot, {
      suggestion: 'BUY',
      stopLoss: '100',
    });
    expect(tradebot.suggestion).toBe('BUY');
    expect(tradebot.stopLoss).toBe('100');
  });
});
