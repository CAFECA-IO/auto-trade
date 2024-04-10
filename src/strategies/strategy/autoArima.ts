import * as ARIMA from 'arima';

export function suggestion(data: {
  currentPrice: number;
  priceArray: number[];
  spreadFee: number;
  holdingStatus: string;
}) {
  let suggestion = 'WAIT';
  const arima = new ARIMA('auto');
  arima.train(data.priceArray);
  // const AbsspreadFee = Math.abs(data.spreadFee);
  const arimaPredict = arima.predict(15);
  const predict: number[] = arimaPredict[0];
  // const predictProfit = AbsspreadFee * 2.8;
  const currentPrice = data.currentPrice;
  if (predict[predict.length - 1] > currentPrice) {
    suggestion = 'BUY';
  }
  if (predict[predict.length - 1] < currentPrice) {
    suggestion = 'SELL';
  }
  if (suggestion === 'WAIT') {
    return suggestion;
  }
  if (data.holdingStatus === 'WAIT') {
    return suggestion;
  }
  if (suggestion !== data.holdingStatus) {
    return 'CLOSE';
  }
  return 'WAIT';
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
