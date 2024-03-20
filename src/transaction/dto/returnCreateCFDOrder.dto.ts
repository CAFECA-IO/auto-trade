export class ReturnCreateCFDOrderDto {
  success: boolean;
  code: string;
  message: string;
  reason: string;
  data: {
    txhash: string;
    balanceSnapshot: {
      id: string;
      userAddress: string;
      currency: string;
      available: string;
      locked: string;
      blockNumber: number;
      createdAt: number;
      updatedAt: number;
    }[];
    orderSnapshot: {
      orderType: string;
      id: string;
      txhash: string;
      orderStatus: string;
      state: string;
      instId: string;
      userAddress: string;
      targetAsset: string;
      unitAsset: string;
      margin: { amount: number; asset: string };
      openPrice: string;
      openSpotPrice: string;
      openSpreadFee: string;
      amount: number;
      fee: number;
      outerFee: string;
      typeOfPosition: string;
      leverage: number;
      guaranteedStop: boolean;
      liquidationPrice: number;
      liquidationTime: number;
      share: boolean;
      updatedTimestamp: number;
      createTimestamp: number;
      pnl: { type: string };
    };
  };
}
