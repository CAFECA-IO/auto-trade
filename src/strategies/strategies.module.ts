import { Module } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { StrategiesController } from './strategies.controller';

@Module({
  controllers: [StrategiesController],
  providers: [StrategiesService],
})
export class StrategiesModule {}
