import { Injectable } from '@nestjs/common';
import * as ARIMA from 'arima';

@Injectable()
export class StrategiesService {
  autoARIMASuggestion(priceArray: number[], spreadFee: number) {
    let suggestion = 'WAIT';
    const arima = new ARIMA('auto');
    arima.train(priceArray);
    const AbsspreadFee = Math.abs(spreadFee);
    const arimaPredict = arima.predict(15);
    const predict: number[] = arimaPredict[0];
    const predictMax = Math.max(...predict);
    const predictMin = Math.min(...predict);
    const currentPrice = priceArray[priceArray.length - 1];
    if (predictMax - currentPrice > AbsspreadFee * 2.5) {
      suggestion = 'BUY';
      return suggestion;
    }
    if (currentPrice - predictMin > AbsspreadFee * 2.5) {
      suggestion = 'SELL';
      return suggestion;
    }
    return suggestion;
  }

  executeStrategy(
    suggestion: string,
    holdingStatus: string,
    openPrice?: number,
    currentPrice?: number,
    openSpreadFee?: number,
    stopLoss?: number,
    takeProfit?: number,
  ) {
    const AbsOpenSpreadFee = Math.abs(openSpreadFee);
    if (holdingStatus === 'WAIT') {
      return suggestion;
    }
    if (holdingStatus === 'BUY') {
      if (
        suggestion === 'SELL' ||
        currentPrice - openPrice > AbsOpenSpreadFee * takeProfit ||
        openPrice - currentPrice > AbsOpenSpreadFee * stopLoss
      ) {
        return 'CLOSE';
      }
    }
    if (holdingStatus === 'SELL') {
      if (
        suggestion === 'BUY' ||
        openPrice - currentPrice > AbsOpenSpreadFee * takeProfit ||
        currentPrice - openPrice > AbsOpenSpreadFee * stopLoss
      ) {
        return 'CLOSE';
      }
    }
    return 'WAIT';
  }
  backTesting(stopLoss, takeProfit, data) {
    let holdingStatus = 'WAIT';
    let openPrice;
    let openSpreadFee;
    const priceArray: number[] = data;
    const tradeArray = [];
    for (let index = 30; index < priceArray.length; index++) {
      const currentPrice = priceArray[index];
      const suggestion = this.autoARIMASuggestion(
        priceArray.slice(index - 30, index),
        0.005 * currentPrice,
      );
      const tradeStrategy = this.executeStrategy(
        suggestion,
        holdingStatus,
        openPrice,
        currentPrice,
        openSpreadFee,
        stopLoss,
        takeProfit,
      );
      if (tradeStrategy === 'CLOSE') {
        if (holdingStatus === 'BUY') {
          const profit = currentPrice - openPrice;
          tradeArray.push({
            // date: dateArray[index],
            openPrice: openPrice,
            price: currentPrice,
            openSpreadFee: openSpreadFee,
            profit: profit,
            tradeStrategy: 'CLOSE-BUY',
          });
        }
        if (holdingStatus === 'SELL') {
          const profit = openPrice - currentPrice;
          tradeArray.push({
            // date: dateArray[index],
            openPrice: openPrice,
            price: currentPrice,
            profit: profit,
            openSpreadFee: openSpreadFee,
            tradeStrategy: 'CLOSE-SELL',
          });
        }
        holdingStatus = 'WAIT';
        openPrice = null;
        openSpreadFee = null;
      }
      if (tradeStrategy === 'BUY' || tradeStrategy === 'SELL') {
        holdingStatus = tradeStrategy;
        openSpreadFee = 0.005 * currentPrice;
        if (holdingStatus === 'BUY') {
          openPrice = currentPrice + openSpreadFee;
        }
        if (holdingStatus === 'SELL') {
          openPrice = currentPrice - openSpreadFee;
        }
        tradeArray.push({
          // date: dateArray[index],
          openPrice: openPrice,
          price: currentPrice,
          profit: 0,
          openSpreadFee: openSpreadFee,
          tradeStrategy: tradeStrategy,
        });
      }
    }
    return { tradeArray };
  }
}
