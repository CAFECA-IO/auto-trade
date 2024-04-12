import { Controller } from '@nestjs/common';
import { PriceTickerService } from './price_ticker.service';

@Controller('price-ticker')
export class PriceTickerController {
  constructor(private readonly priceTickerService: PriceTickerService) {}
}
