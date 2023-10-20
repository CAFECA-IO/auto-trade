import { Quotation } from '../../price_ticker/entities/quotation.entity';

export class CreateCFDOrder {
  ticker: string; // target currency e.g. "BTC"
  quotation: Quotation; // 報價單
  typeOfPosition: string; // "SELL" or "BUY"
  price: number;
  amount: number; //0.3
  targetAsset: string; // target currency e.g. "BTC"
  unitAsset: string; // "USDT"
  margin: object; // should be a class
  leverage: number; // 5
  liquidationPrice: number; // 強制平倉價格
  liquidationTime: number;
  guaranteedStop: boolean; // false
  fee: number; //0
  guaranteedStopFee?: number;
  createTimestamp?: number;
  takeProfit?: number;
  stopLoss?: number;
  remark?: string;
}
