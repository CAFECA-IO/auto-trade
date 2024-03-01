export class QuotationDto {
  success: boolean;
  code: string;
  reason: string;
  data: {
    instId: string;
    targetAsset: string;
    unitAsset: string;
    typeOfPosition: string; //BUY or SELL
    price: string;
    spotPrice: string;
    spreadFee: string;
    deadline: number;
    signature: string;
  };
}
