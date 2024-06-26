import { QuotationDto } from '../../price_ticker/dto/quotation.dto';
import { MarginDto } from './margin.dto';

export class CreateCFDOrderDTO {
  operation: string; // CREATE
  orderType: string; // CFD
  instId: string;
  quotation: QuotationDto['data'];
  typeOfPosition: string; //BUY or SELL
  price: number;
  amount: number;
  targetAsset: string;
  unitAsset: string;
  margin: MarginDto;
  leverage: number; // 5 maybe can change
  liquidationPrice: number; // price * (1 - LIQUIDATION_FIVE_LEVERAGE)
  liquidationTime: number; // getTimestamp() + 86400
  guaranteedStop: boolean; // false
  fee: number; // 0
  createTimestamp: number;
  guaranteedStopFee?: string;
  takeProfit?: string;
  stopLoss?: string;
  outerFee?: string;
  remark?: string;
}
