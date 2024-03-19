import { Injectable } from '@nestjs/common';

@Injectable()
export class StrategiesService {
  async getSuggestion(strategyName: string, data: Record<string, any>) {
    const strategyModule = await import('./strategy/' + strategyName);
    const suggestion = await strategyModule.suggestion(data);
    return suggestion;
  }

  async getTradeStrategy(strategyName: string, data: Record<string, any>) {
    const strategyModule = await import('./strategy/' + strategyName);
    const tradeStrategy = await strategyModule.tradeStrategy(data);
    return tradeStrategy;
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
  async backTesting(suggestion, strategy, stopLoss, takeProfit, priceData) {
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
        priceArray: priceArray.slice(index - 30, index),
        spreadFee: spreadFee,
      });
      const tradeStrategy = await this.getTradeStrategy(strategy, {
        suggestion: suggestionResult,
        holdingStatus: holdingStatus,
      });
      if (holdingStatus !== 'WAIT') {
        stopLossResult = await this.getStopLoss(stopLoss, {
          openPrice: openPrice,
          currentPrice: currentPrice,
          spreadFee: spreadFee,
          holdingStatus: holdingStatus,
        });
        takeProfitResult = await this.getTakeProfit(takeProfit, {
          openPrice: openPrice,
          currentPrice: currentPrice,
          spreadFee: spreadFee,
          holdingStatus: holdingStatus,
        });
      }
      if (
        tradeStrategy === 'CLOSE' ||
        stopLossResult === 'CLOSE' ||
        takeProfitResult === 'CLOSE'
      ) {
        if (holdingStatus === 'BUY') {
          const profit = currentPrice - openPrice;
          tradeArray.push({
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
        openSpreadFee = spreadFee;
        if (holdingStatus === 'BUY') {
          openPrice = currentPrice + openSpreadFee;
        }
        if (holdingStatus === 'SELL') {
          openPrice = currentPrice - openSpreadFee;
        }
        tradeArray.push({
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
