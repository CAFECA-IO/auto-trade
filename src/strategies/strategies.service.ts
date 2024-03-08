import { Injectable } from '@nestjs/common';
import { ARIMA } from 'arima';

@Injectable()
export class StrategiesService {
  autoARIMA() {
    const hello = [1, 2, 3, 4, 5, 6, 7, 7, 7, 4];
    const arima = new ARIMA({ auto: true });
    arima.train(hello);
    arima.forecast(3);
  }
}
