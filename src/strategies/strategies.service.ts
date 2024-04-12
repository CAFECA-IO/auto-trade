import { Injectable } from '@nestjs/common';
import { Environment } from './strategy/rl-dqn/environment';
import * as fs from 'fs';
import { TradeAgent } from './strategy/rl-dqn/tradeAgent';
import { train } from './strategy/rl-dqn/train';

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
        suggestionResult === 'CLOSE' ||
        stopLossResult === 'CLOSE' ||
        takeProfitResult === 'CLOSE'
      ) {
        if (holdingStatus === 'BUY') {
          const profit = currentPrice - spreadFee - openPrice;
          tradeArray.push({
            openPrice: openPrice,
            price: currentPrice,
            profit: profit,
            holdingStatus: holdingStatus,
            tradeStrategy: 'CLOSE-BUY',
          });
        }
        if (holdingStatus === 'SELL') {
          const profit = openPrice - (currentPrice + spreadFee);
          tradeArray.push({
            openPrice: openPrice,
            price: currentPrice,
            profit: profit,
            holdingStatus: holdingStatus,
            tradeStrategy: 'CLOSE-SELL',
          });
        }
        holdingStatus = 'WAIT';
        openPrice = null;
        continue;
      }
      if (suggestionResult !== 'WAIT' && holdingStatus === 'WAIT') {
        holdingStatus = suggestionResult;
        openPrice = JSON.parse(JSON.stringify(currentPrice));
        tradeArray.push({
          openPrice: openPrice,
          price: currentPrice,
          profit: 0,
          holdingStatus: holdingStatus,
          suggestionResult: suggestionResult,
        });
      }
      continue;
    }
    return { tradeArray };
  }

  async trainDqn() {
    // const csvContent = fs.readFileSync('src/strategies/ETH-USD.csv', 'utf8');
    const etharr = fs.readFileSync('src/strategies/etharr.txt', 'utf8');
    console.log("🚀 ~ StrategiesService ~ trainDqn ~ etharr:", etharr)
    const rows = etharr.split('\n');
    // Define the index of the column you want to read
    const closeIndex = 4;
    // Extract the data from the specified column
    const priceData = rows.map((row) => {
      const columns = row.split(','); // Split by comma (adjust delimiter as necessary)
      return parseFloat(columns[closeIndex]);
    });
    const env = new Environment(priceData.slice(1));
    const tradeAgent = new TradeAgent(env);
    await train(tradeAgent);
  }
}
