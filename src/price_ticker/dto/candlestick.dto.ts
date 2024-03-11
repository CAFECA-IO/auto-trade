class CandlestickData {
  x: Date;
  y: {
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
  };
}

export class CandlestickDto {
  code: string;
  success: boolean;
  data: {
    instId: string;
    candlesticks: CandlestickData[];
  };
}
