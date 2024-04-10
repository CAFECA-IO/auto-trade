import { Controller, Get } from '@nestjs/common';
import { StrategiesService } from './strategies.service';

@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Get()
  async trainDqn() {
    this.strategiesService.trainDqn();
  }
}
