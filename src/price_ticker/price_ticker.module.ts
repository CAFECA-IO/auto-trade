import { Module } from '@nestjs/common';
import PriceTickerService from './price_ticker.service';
import { PriceTickerController } from './price_ticker.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PriceTickerController],
  providers: [PriceTickerService],
  exports: [PriceTickerService],
})
export class PriceTickerModule {}
