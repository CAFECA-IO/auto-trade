import * as ARIMA from 'arima';

export function suggestion(data: { priceArray: number[]; spreadFee: number }) {
  let suggestion = 'WAIT';
  const arima = new ARIMA('auto');
  arima.train(data.priceArray);
  const AbsspreadFee = Math.abs(data.spreadFee);
  const arimaPredict = arima.predict(15);
  const predict: number[] = arimaPredict[0];
  const predictMax = Math.max(...predict);
  const predictMin = Math.min(...predict);
  const predictProfit = AbsspreadFee * 2.5;
  const currentPrice = data.priceArray[data.priceArray.length - 1];
  if (predictMax - currentPrice > predictProfit) {
    suggestion = 'BUY';
    return suggestion;
  }
  if (currentPrice - predictMin > predictProfit) {
    suggestion = 'SELL';
    return suggestion;
  }
  return suggestion;
}

export function tradeStrategy(data: {
  suggestion: string;
  holdingStatus: string;
}) {
  if (data.holdingStatus === 'WAIT') {
    return data.suggestion;
  }
  if (data.holdingStatus === 'BUY') {
    if (data.suggestion === 'SELL') {
      return 'CLOSE';
    }
  }
  if (data.holdingStatus === 'SELL') {
    if (data.suggestion === 'BUY') {
      return 'CLOSE';
    }
  }
  return 'WAIT';
}
export function takeProfit(data: {
  openPrice: number;
  currentPrice: number;
  spreadFee: number;
  holdingStatus: string;
}) {
  const AbsOpenSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const takeProfit = AbsOpenSpreadFee * 2.2;
  const holdingStatus = data.holdingStatus;
  if (holdingStatus === 'BUY') {
    if (currentPrice - openPrice > takeProfit) {
      return 'CLOSE';
    }
  }
  if (holdingStatus === 'SELL') {
    if (openPrice - currentPrice < takeProfit) {
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
  const AbsOpenSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const stopLoss = AbsOpenSpreadFee * 1.5;
  const holdingStatus = data.holdingStatus;
  if (holdingStatus === 'BUY') {
    if (openPrice - currentPrice > stopLoss) {
      return 'CLOSE';
    }
  }
  if (holdingStatus === 'SELL') {
    if (currentPrice - openPrice > stopLoss) {
      return 'CLOSE';
    }
  }
  return 'WAIT';
}
