import { Controller, Get } from '@nestjs/common';
import PriceTickerService from './price_ticker.service';

@Controller('price-ticker')
export class PriceTickerController {
  constructor(private readonly priceTickerService: PriceTickerService) {}
  @Get()
  async checkPrice() {
    const quotation = await this.priceTickerService.getCFDQuotation();
    const priceArray = await this.priceTickerService.getCandlesticks();
    return (
      'quotation = ' + JSON.stringify(quotation) + ' priceArray = ' + priceArray
    );
  }
}
