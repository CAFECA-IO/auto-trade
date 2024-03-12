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

  it('should create', () => {
    const result = service.create();
    console.log('🚀 ~ it ~ result:', result);
  });
});
