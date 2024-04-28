export function suggestion(data: {
  currentPrice: number;
  priceArray: number[];
  spreadFee: number;
  holdingStatus: string;
}) {
  let suggestion = 'WAIT';
  const priceArray = data.priceArray;
  const currentPrice = data.currentPrice;
  const lastHourPrice = priceArray[priceArray.length - 35];
  if (currentPrice > lastHourPrice) {
    suggestion = 'BUY';
  }
  if (currentPrice < lastHourPrice) {
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
