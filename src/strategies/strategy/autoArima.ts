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
  const AbsspreadFee = Math.abs(data.spreadFee);
  const arimaPredict = arima.predict(36);
  const predict: number[] = arimaPredict[0];
  const predictMax = Math.max(...predict);
  const predictMin = Math.min(...predict);
  const predictProfit = AbsspreadFee * 2.2;
  const currentPrice = data.currentPrice;
  if (predictMax - currentPrice > predictProfit) {
    suggestion = 'BUY';
  }
  if (currentPrice - predictMin > predictProfit) {
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
  const AbsOpenSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const takeProfit = AbsOpenSpreadFee * 1.8;
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
  const stopLoss = AbsOpenSpreadFee * 0.6;
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
