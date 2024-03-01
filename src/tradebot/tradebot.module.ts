import { Module } from '@nestjs/common';
import { TradebotService } from './tradebot.service';
import { TradebotController } from './tradebot.controller';

@Module({
  controllers: [TradebotController],
  providers: [TradebotService],
})
export class TradebotModule {}
