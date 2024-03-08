import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { QuotationDto } from './dto/quotation.dto';

@Injectable()
export class PriceTickerService {
  constructor(private readonly httpService: HttpService) {}

  async getCFDQuotation(
    typeOfPosition: string = 'BUY',
    instId: string = 'ETH-USDT',
  ): Promise<QuotationDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<QuotationDto>(
        'https://api.tidebit-defi.com/api/v1/market/quotation/' + instId,
        {
          params: {
            typeOfPosition: typeOfPosition,
          },
        },
      ),
    );
    return data;
  }

  async getTickers(instId: string = 'ETH-USDT'): Promise<number[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(
        'https://api.tidebit-defi.com/api/v1/market/tickers ',
      ),
    );
    if (instId === 'ETH-USDT') {
      return data.data[0].lineGraphProps.dataArray;
    }
    if (instId === 'BTC-USDT') {
      return data.data[1].lineGraphProps.dataArray;
    }
    return data;
  }
}
