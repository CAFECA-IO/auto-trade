import { Injectable } from '@nestjs/common';

@Injectable()
export class StrategiesService {
  async getSuggestion(strategyName: string, data: Record<string, any>) {
    const strategyModule = await import('./strategy/' + strategyName);
    const suggestion = await strategyModule.suggestion(data);
    return suggestion;
  }

  async getTakeProfit(strategyName: string, data: Record<string, any>) {
    const strategyModule = await import('./strategy/' + strategyName);
    const takeProfit = await strategyModule.takeProfit(data);
    return takeProfit;
  }

  async getStopLoss(strategyName: string, data: Record<string, any>) {
    const strategyModule = await import('./strategy/' + strategyName);
    const stopLoss = await strategyModule.stopLoss(data);
    return stopLoss;
  }
  async backTesting(suggestion, stopLoss, takeProfit, priceData) {
    let holdingStatus = 'WAIT';
    let openPrice;
    let openSpreadFee;
    const priceArray: number[] = priceData;
    const tradeArray = [];
    for (let index = 30; index < priceArray.length; index++) {
      const currentPrice = priceArray[index];
      const spreadFee = 0.005 * currentPrice;
      let stopLossResult;
      let takeProfitResult;
      const suggestionResult = await this.getSuggestion(suggestion, {
        currentPrice: currentPrice,
        priceArray: priceArray.slice(index - 30, index),
        spreadFee: spreadFee,
        holdingStatus: holdingStatus,
      });
      if (holdingStatus !== 'WAIT') {
        stopLossResult = await this.getStopLoss(stopLoss, {
          openPrice: openPrice,
          currentPrice: currentPrice + spreadFee,
          spreadFee: spreadFee,
          holdingStatus: holdingStatus,
        });
        takeProfitResult = await this.getTakeProfit(takeProfit, {
          openPrice: openPrice,
          currentPrice: currentPrice + spreadFee,
          spreadFee: spreadFee,
          holdingStatus: holdingStatus,
        });
      }
      if (
        suggestionResult === 'CLOSE' ||
        stopLossResult === 'CLOSE' ||
        takeProfitResult === 'CLOSE'
      ) {
        if (holdingStatus === 'BUY') {
          const profit = currentPrice - openPrice - openSpreadFee;
          tradeArray.push({
            openPrice: openPrice,
            price: currentPrice,
            openSpreadFee: openSpreadFee,
            profit: profit,
            holdingStatus: holdingStatus,
            tradeStrategy: 'CLOSE-BUY',
          });
        }
        if (holdingStatus === 'SELL') {
          const profit = openPrice - currentPrice - openSpreadFee;
          tradeArray.push({
            openPrice: openPrice,
            price: currentPrice,
            profit: profit,
            openSpreadFee: openSpreadFee,
            holdingStatus: holdingStatus,
            tradeStrategy: 'CLOSE-SELL',
          });
        }
        holdingStatus = 'WAIT';
        openPrice = null;
        openSpreadFee = null;
      }
      if (suggestionResult !== 'WAIT' && holdingStatus === 'WAIT') {
        openSpreadFee = spreadFee;
        holdingStatus = suggestionResult;
        openPrice = JSON.parse(JSON.stringify(currentPrice));
        tradeArray.push({
          openPrice: openPrice,
          price: currentPrice,
          profit: 0,
          openSpreadFee: openSpreadFee,
          holdingStatus: holdingStatus,
          suggestionResult: suggestionResult,
        });
      }
    }
    return { tradeArray };
  }
}
