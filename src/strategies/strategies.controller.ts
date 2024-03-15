import { Controller } from '@nestjs/common';
import { StrategiesService } from './strategies.service';

@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}
}
