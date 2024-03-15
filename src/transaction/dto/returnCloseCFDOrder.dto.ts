export class ReturnCloseCFDOrderDto {
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
      amount: string;
      closePrice: string;
      closeSpotPrice: string;
      closeSpreadFee: string;
      closeTimestamp: number;
      closedType: string;
      createTimestamp: number;
      fee: string;
      forcedClose: boolean;
      guaranteedStop: boolean;
      id: string;
      instId: string;
      leverage: number;
      liquidationPrice: string;
      liquidationTime: number;
      margin: {
        amount: string;
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
        value: string;
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
    success: boolean;
    typeOfPosition: string;
    unitAsset: string;
    updatedTimestamp: number;
    userAddress: string;
  };
  txhash: string;
  success: boolean;
}
