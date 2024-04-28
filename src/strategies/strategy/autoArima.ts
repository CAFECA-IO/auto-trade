import * as ARIMA from 'arima';
import { rsi } from 'technicalindicators';

export function suggestion(data: {
  currentPrice: number;
  priceArray: number[];
  spreadFee: number;
  holdingStatus: string;
  rsiValue: number; // add this as a new field
}) {
  let suggestion = 'WAIT';
  const arima = new ARIMA('auto');
  arima.train(data.priceArray);
  const arimaPredict = arima.predict(15);
  const predict: number[] = arimaPredict[0];
  const currentPrice = data.currentPrice;
  const rsiInput = {
    period: 14, // Set the desired value for the period property
    values: data.priceArray, // Pass the data.priceArray as the values property
  };
  const rsiValue = rsi(rsiInput);
  const rsiAverage = average(rsiValue, 3); // calculate a moving average of the RSI
  if (predict[predict.length - 1] > currentPrice && rsiAverage < 70) {
    // buy signal with low RSI
    suggestion = 'BUY';
  } else if (predict[predict.length - 1] < currentPrice && rsiAverage > 30) {
    // sell signal with high RSI
    suggestion = 'SELL';
  }
  if (suggestion === 'WAIT') {
    return suggestion;
  }
  if (data.holdingStatus === 'WAIT' || data.holdingStatus === suggestion) {
    return suggestion;
  } else {
    return 'CLOSE'; // close the position when the suggestion changes
  }
}

function average(arr: number[], n: number): number {
  return arr.reduce((a, b) => a + b, 0) / n;
}

export function takeProfit(data: {
  openPrice: number;
  currentPrice: number;
  spreadFee: number;
  holdingStatus: string;
}) {
  const AbsSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const takeProfit = AbsSpreadFee * 1.5;
  const holdingStatus = data.holdingStatus;
  if (holdingStatus === 'BUY') {
    // Info: (20240328 - Jacky) Current Sell price is higher than the open Buy price
    if (currentPrice - AbsSpreadFee - openPrice > takeProfit) {
      return 'CLOSE';
    }
  }
  if (holdingStatus === 'SELL') {
    // Info: (20240328 - Jacky) Current Buy price is lower than the open Sell price
    if (openPrice - (currentPrice + AbsSpreadFee) > takeProfit) {
      return 'CLOSE';
    }
  }
  return 'WAIT';
}
export function stopLoss(data: {
  openPrice: number;
  currentPrice: number;
  spreadFee: number;
  holdingStatus: string;
}) {
  const AbsSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const stopLoss = AbsSpreadFee * 1;
  const holdingStatus = data.holdingStatus;
  if (holdingStatus === 'BUY') {
    // Info: (20240328 - Jacky) Current Buy price is lower than the open Buy price
    if (openPrice - (currentPrice + AbsSpreadFee) > stopLoss) {
      return 'CLOSE';
    }
  }
  if (holdingStatus === 'SELL') {
    // Info: (20240328 - Jacky) Current Sell price is higher than the open Sell price
    if (currentPrice - AbsSpreadFee - openPrice > stopLoss) {
      return 'CLOSE';
    }
  }
  return 'WAIT';
}
