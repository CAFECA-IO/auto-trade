import { Module } from '@nestjs/common';
import { TradebotService } from './tradebot.service';
import { TradebotController } from './tradebot.controller';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { StrategiesModule } from '../strategies/strategies.module';
import { DewtModule } from '../dewt/dewt.module';
import { PriceTickerService } from 'src/price_ticker/price_ticker.service';
import { StrategiesService } from 'src/strategies/strategies.service';
import { DewtService } from 'src/dewt/dewt.service';
import { Transaction } from 'ethers';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    PriceTickerModule,
    StrategiesModule,
    DewtModule,
    TransactionModule,
    UserModule,
    HttpModule,
  ],
  controllers: [TradebotController],
  providers: [
    TradebotService,
    PriceTickerService,
    StrategiesService,
    DewtService,
    TransactionService,
    UserService,
  ],
})
export class TradebotModule {}
