import * as ARIMA from 'arima';

export function getSuggestion(data: {
  priceArray: number[];
  spreadFee: number;
}) {
  let suggestion = 'WAIT';
  const arima = new ARIMA('auto');
  arima.train(data.priceArray);
  const AbsspreadFee = Math.abs(data.spreadFee);
  const arimaPredict = arima.predict(15);
  const predict: number[] = arimaPredict[0];
  const predictMax = Math.max(...predict);
  const predictMin = Math.min(...predict);
  const currentPrice = data.priceArray[data.priceArray.length - 1];
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
  takeProfitLeverage: number;
}) {
  const AbsOpenSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const takeProfitLeverage = data.takeProfitLeverage;
  const holdingStatus = data.holdingStatus;
  if (holdingStatus === 'BUY') {
    if (currentPrice - openPrice > AbsOpenSpreadFee * takeProfitLeverage) {
      return 'CLOSE';
    }
  }
  if (holdingStatus === 'SELL') {
    if (openPrice - currentPrice < AbsOpenSpreadFee * takeProfitLeverage) {
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
  stopLossLeverage: number;
}) {
  const AbsOpenSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const stopLossLeverage = data.stopLossLeverage;
  const holdingStatus = data.holdingStatus;
  if (holdingStatus === 'BUY') {
    if (openPrice - currentPrice > AbsOpenSpreadFee * stopLossLeverage) {
      return 'CLOSE';
    }
  }
  if (holdingStatus === 'SELL') {
    if (currentPrice - openPrice > AbsOpenSpreadFee * stopLossLeverage) {
      return 'CLOSE';
    }
  }
  return 'WAIT';
}
