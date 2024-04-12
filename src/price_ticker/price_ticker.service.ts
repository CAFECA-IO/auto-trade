import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { QuotationDto } from './dto/quotation.dto';
import { CandlestickDto } from './dto/candlestick.dto';
import { DOMAIN_BACKEND } from '../common/constants/config';

@Injectable()
export class PriceTickerService {
  constructor(private readonly httpService: HttpService) {}

  async getCFDQuotation(
    typeOfPosition: string = 'BUY',
    instId: string = 'ETH-USDT',
  ): Promise<QuotationDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<QuotationDto>(
        DOMAIN_BACKEND + '/market/quotation/' + instId,
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
        DOMAIN_BACKEND + '/market/tickers?limit=50&timespan=5m',
      ),
    );
    if (instId === 'ETH-USDT') {
      const priceArray = data.data[0].lineGraphProps.dataArray;
      return priceArray;
    }
    if (instId === 'BTC-USDT') {
      const priceArray = data.data[1].lineGraphProps.dataArray;
      return priceArray;
    }
    return data;
  }

  async getCandlesticks(
    instId: string = 'ETH-USDT',
    timeSpan: string = '5m',
    limit: number = 100,
  ): Promise<number[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<CandlestickDto>(
        DOMAIN_BACKEND +
          '/candlesticks/' +
          instId +
          '?timeSpan=' +
          timeSpan +
          '&limit=' +
          limit,
      ),
    );
    const priceArray = data.data.candlesticks.map((item) => item.y.close);
    return priceArray;
  }

  async getCandlesticksV2(
    instId: string = 'ETH-USDT',
    timeSpan: string = '5m',
    begin: number = 0,
    end: number = 0,
    limit: number = 300,
  ): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(
        'https://api.tidebit-defi.com/api/v2' +
          '/candlesticks/' +
          instId +
          '?timeSpan=' +
          timeSpan +
          '&begin=' +
          begin +
          '&end=' +
          end +
          '&limit=' +
          limit,
      ),
    );
    return data;
  }
}
