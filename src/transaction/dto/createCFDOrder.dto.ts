import { QuotationDto } from '../../price_ticker/dto/quotation.dto';
import { MarginDto } from './margin.dto';

export class CreateCFDOrderDTO {
  instId: string;
  quotation: QuotationDto;
  typeOfPosition: string; //BUY or SELL
  price: string;
  amount: string;
  targetAsset: string;
  unitAsset: string;
  margin: MarginDto;
  leverage: number; // 5
  liquidationPrice: string;
  liquidationTime: number;
  guaranteedStop: boolean; // false
  fee: string; // 0
  guaranteedStopFee?: string;
  createTimestamp?: number;
  takeProfit?: string;
  stopLoss?: string;
  outerFee?: string;
  remark?: string;
}
