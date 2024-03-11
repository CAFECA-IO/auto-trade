import { Injectable } from '@nestjs/common';
import * as ARIMA from 'arima';
import { QuotationDto } from 'src/price_ticker/dto/quotation.dto';

@Injectable()
export class StrategiesService {
  autoARIMA(priceArray: number[], quotation: QuotationDto) {
    let suggestion = 'wait';
    const arima = new ARIMA('auto');
    arima.train(priceArray);
    const AbsspreadFee = Math.abs(quotation.data.spreadFee);
    const arimaPredict = arima.predict(300);
    const predict: number[] = arimaPredict[0];
    const predictMax = Math.max(...predict);
    const predictMin = Math.min(...predict);
    const lastPrice = priceArray[priceArray.length - 1];
    if (predictMax - lastPrice > AbsspreadFee * 1.5) {
      suggestion = 'BUY';
      return suggestion;
    }
    if (lastPrice - predictMin > AbsspreadFee * 1.5) {
      suggestion = 'SELL';
      return suggestion;
    }
    return suggestion;
  }
}
