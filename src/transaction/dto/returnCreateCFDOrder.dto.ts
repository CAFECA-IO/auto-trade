export class ReturnCreateCFDOrderDto {
  code: string;
  data: {
    balanceSnapshot: [
      {
        available: string;
        blockNumber: number;
        createdAt: number;
        currency: string;
        id: string;
        locked: string;
        updatedAt: number;
        userAddress: string;
      },
    ];
    orderSnapshot: {
      amount: number;
      createTimestamp: number;
      fee: number;
      guaranteedStop: boolean;
      id: string;
      instId: string;
      leverage: number;
      liquidationPrice: number;
      liquidationTime: number;
      margin: {
        amount: number;
        asset: string;
      };
      openPrice: string;
      openSpotPrice: string;
      openSpreadFee: string;
      orderStatus: string;
      orderType: string;
      outerFee: string;
      pnl: {
        type: string;
      };
      share: boolean;
      state: string;
      targetAsset: string;
      txhash: string;
      typeOfPosition: string;
      unitAsset: string;
      updatedTimestamp: number;
      userAddress: string;
    };
    txhash: string;
  };
  success: boolean;
}
