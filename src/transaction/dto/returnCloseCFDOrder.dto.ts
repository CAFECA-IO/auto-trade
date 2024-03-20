export class ReturnCloseCFDOrderDto {
  code: string;
  success: boolean;
  message: string;
  reason: string;
  data: {
    txhash: string;
    balanceSnapshot: {
      available: string;
      blockNumber: number;
      createdAt: number;
      currency: string;
      id: string;
      locked: string;
      updatedAt: number;
      userAddress: string;
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
      margin: { amount: string; asset: string };
      openPrice: string;
      openSpotPrice: string;
      openSpreadFee: string;
      amount: string;
      fee: string;
      outerFee: string;
      typeOfPosition: string;
      leverage: number;
      guaranteedStop: boolean;
      liquidationPrice: string;
      liquidationTime: number;
      share: boolean;
      updatedTimestamp: number;
      createTimestamp: number;
      closePrice: string;
      closeSpotPrice: string;
      closeSpreadFee: string;
      closedType: string;
      closeTimestamp: number;
      forcedClose: boolean;
      pnl: {
        today: {
          amount: { type: string; value: string };
          percentage: { type: string; value: string };
        };
        monthly: {
          amount: { type: string; value: string };
          percentage: { type: string; value: string };
        };
        cumulative: {
          amount: { type: string; value: string };
          percentage: { type: string; value: string };
        };
      };
    };
  };
}
