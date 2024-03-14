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
  purchaseStrategy(suggestion: string, holdingStatus: string) {
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

  closeStrategy(
    openPrice: number,
    currentPrice: number,
    spreadFee: number,
    holdingStatus: string,
  ) {
    const AbsspreadFee = Math.abs(spreadFee);
    if (holdingStatus === 'BUY') {
      if (currentPrice - openPrice > AbsspreadFee * 2) {
        return 'CLOSE';
      }
      if (openPrice - currentPrice < AbsspreadFee * -0.5) {
        return 'CLOSE';
      }
      return 'WAIT';
    }
    if (holdingStatus === 'SELL') {
      if (openPrice - currentPrice < AbsspreadFee * -2) {
        return 'CLOSE';
      }
      if (currentPrice - openPrice > AbsspreadFee * 0.5) {
        return 'CLOSE';
      }
      return 'WAIT';
    }
    return 'WAIT';
  }
  backTest() {}
}
