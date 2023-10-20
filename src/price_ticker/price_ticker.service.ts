import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PriceTicker } from './entities/price_ticker.entity';
import { Observable, firstValueFrom, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Quotation } from './entities/quotation.entity';

@Injectable()
export class PriceTickerService {
  constructor(private readonly httpService: HttpService) {}

  // findAll(): Observable<AxiosResponse<PriceTicker[]>> {
  // const res: any = this.httpService
  //   .get('https://api.tidebit-defi.com/market/qutation/ETH-USDT')
  //   .pipe(map((res) => res.data));
  // console.log(res); // 这里直接打印不出来数据格式的，都是映射函数,需要用subscribe观察
  // res.subscribe((val) => console.log(val)); // 订阅观察了，就可以打印出来
  // return res;

  // }
  async getCFDQuotation(typeOfPosition: string): Promise<Quotation> {
    const { data } = await firstValueFrom(
      this.httpService.get<Quotation>(
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
