import { Injectable } from '@nestjs/common';
import * as ARIMA from 'arima';
import { QuotationDto } from 'src/price_ticker/dto/quotation.dto';

@Injectable()
export class StrategiesService {
  autoARIMASuggestion(priceArray: number[], spreadFee: number) {
    let suggestion = 'WAIT';
    const arima = new ARIMA('auto');
    arima.train(priceArray);
    const AbsspreadFee = Math.abs(spreadFee);
    const arimaPredict = arima.predict(50);
    const predict: number[] = arimaPredict[0];
    const predictMax = Math.max(...predict);
    const predictMin = Math.min(...predict);
    const lastPrice = priceArray[priceArray.length - 1];
    if (predictMax - lastPrice > AbsspreadFee * 1.3) {
      suggestion = 'BUY';
      return suggestion;
    }
    if (lastPrice - predictMin > AbsspreadFee * 1.3) {
      suggestion = 'SELL';
      return suggestion;
    }
    return suggestion;
  }
  runTradeStrategy(suggestion: string, holdingStatus: string) {
    if (suggestion === 'BUY') {
      if (holdingStatus === 'WAIT') {
        return 'BUY';
      }
      if (holdingStatus === 'SELL') {
        return 'CLOSE';
      }
      if (holdingStatus === 'BUY') {
        return 'WAIT';
      }
    }
    if (suggestion === 'SELL') {
      if (holdingStatus === 'WAIT') {
        return 'SELL';
      }
      if (holdingStatus === 'BUY') {
        return 'CLOSE';
      }
      if (holdingStatus === 'SELL') {
        return 'WAIT';
      }
    }
  }

  stopStrategy() {}
  backTest() {}
}
