export class QuotationDto {
  success: boolean;
  code: string;
  reason: string;
  data: {
    instId: string;
    targetAsset: string;
    unitAsset: string;
    typeOfPosition: string; //BUY or SELL
    price: number;
    spotPrice: number;
    spreadFee: number;
    deadline: number;
    signature: string;
  };
}
