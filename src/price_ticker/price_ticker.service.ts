import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { QuotationDto } from './dto/quotation.dto';

@Injectable()
export class PriceTickerService {
  constructor(private readonly httpService: HttpService) {}

  async getCFDQuotation(typeOfPosition: string): Promise<QuotationDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<QuotationDto>(
        'https://api.tidebit-defi.com/api/v1/market/quotation/ETH-USDT',
        {
          params: {
            typeOfPosition: typeOfPosition,
          },
        },
      ),
    );
    return data;
  }
}
