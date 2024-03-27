export function suggestion(data: {
  currentPrice: number;
  priceArray: number[];
  spreadFee: number;
  holdingStatus: string;
}) {
  let suggestion = 'WAIT';
  const random = Math.random();
  if (random > 0.9) {
    suggestion = 'BUY';
  }
  if (random < 0.1) {
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
