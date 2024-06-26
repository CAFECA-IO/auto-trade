import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PriceTickerModule, HttpModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
