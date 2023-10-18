import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PriceTickerModule } from './price_ticker/price_ticker.module';
import { DewtModule } from './dewt/dewt.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [UserModule, PriceTickerModule, DewtModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
