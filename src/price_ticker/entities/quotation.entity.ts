export class Quotation {
  success: boolean;
  code: string;
  reason: string;
  data: {
    ticker: string;
    targetAsset: string; // target currency eg. "BTC"
    unitAsset: string;
    typeOfPosition: string;
    price: number;
    deadline: number;
    signature: string;
  };
}
